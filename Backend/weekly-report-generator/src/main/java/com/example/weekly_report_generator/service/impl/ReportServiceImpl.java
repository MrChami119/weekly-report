package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.request.AchievementEntryRequest;
import com.example.weekly_report_generator.dto.request.BlockerEntryRequest;
import com.example.weekly_report_generator.dto.request.ReportCreateOrUpdateRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;
import com.example.weekly_report_generator.dto.response.ReportSummaryResponse;
import com.example.weekly_report_generator.entity.*;
import com.example.weekly_report_generator.enums.ReportStatus;
import com.example.weekly_report_generator.enums.Role;
import com.example.weekly_report_generator.exception.ResourceNotFoundException;
import com.example.weekly_report_generator.mapper.ReportMapper;
import com.example.weekly_report_generator.repository.ProjectRepository;
import com.example.weekly_report_generator.repository.ReportRepository;
import com.example.weekly_report_generator.repository.ReportVersionRepository;
import com.example.weekly_report_generator.repository.UserRepository;
import com.example.weekly_report_generator.service.ReportService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final ReportVersionRepository reportVersionRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;

    @Override
    @Transactional
    public ReportDetailResponse createDraft(Long userId, ReportCreateOrUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        reportRepository.findByUserIdAndWeekStartDate(userId, request.weekStartDate())
                .ifPresent(r -> { throw new IllegalStateException("A report for this week already exists"); });

        Report report = new Report();
        report.setUser(user);
        report.setWeekStartDate(request.weekStartDate());
        report.setWeekEndDate(request.weekEndDate());
        report.setStatus(ReportStatus.DRAFT);

        ReportVersion version = buildVersionFromRequest(request, 1);
        version.setReport(report);
        report.getVersions().add(version);


        Report saved = reportRepository.save(report);
        return reportMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public ReportDetailResponse updateDraft(Long userId, Long reportId, ReportCreateOrUpdateRequest request) {
        Report report = getOwnedReportOrThrow(reportId, userId);

        if (report.getStatus() != ReportStatus.DRAFT && report.getStatus() != ReportStatus.NEEDS_CORRECTION) {
            throw new IllegalStateException("Report can only be edited while in DRAFT or NEEDS_CORRECTION status");
        }

        ReportVersion current = report.getCurrentVersion();

        if (report.getStatus() == ReportStatus.DRAFT) {
            // still mutable in-place, no new version needed
            applyRequestToVersion(current, request);
        } else {
            // NEEDS_CORRECTION -> clone into a new editable version, old one stays frozen with its comment
            ReportVersion newVersion = buildVersionFromRequest(request, current.getVersionNumber() + 1);
            newVersion.setReport(report);
            report.getVersions().add(newVersion);

            report.setStatus(ReportStatus.DRAFT); // back to draft while they work on the correction
        }

        Report saved = reportRepository.save(report);
        return reportMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public ReportDetailResponse submitReport(Long userId, Long reportId) {
        Report report = getOwnedReportOrThrow(reportId, userId);

        if (report.getStatus() != ReportStatus.DRAFT) {
            throw new IllegalStateException("Only a DRAFT report can be submitted");
        }

        ReportVersion current = report.getCurrentVersion();
        validateVersionBeforeSubmit(current);

        current.setSubmittedAt(Instant.now());
        report.setStatus(ReportStatus.SUBMITTED);

        Report saved = reportRepository.save(report);
        return reportMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportDetail(Long reportId, Long requestingUserId, Role requestingUserRole) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        boolean isOwner = report.getUser().getId().equals(requestingUserId);
        boolean isManagerOrAdmin = requestingUserRole == Role.MANAGER || requestingUserRole == Role.ADMIN;

        if (!isOwner && !isManagerOrAdmin) {
            throw new AccessDeniedException("You do not have access to this report");
        }

        return reportMapper.toDetailResponse(report);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportSummaryResponse> getMyReports(Long userId, ReportStatus statusFilter, Pageable pageable) {
        Page<Report> page = (statusFilter == null)
                ? reportRepository.findByUserId(userId, pageable)
                : reportRepository.findByUserIdAndStatus(userId, statusFilter, pageable);

        return page.map(reportMapper::toSummaryResponse);
    }

    private Report getOwnedReportOrThrow(Long reportId, Long userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (!report.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You do not own this report");
        }
        return report;
    }

    private ReportVersion buildVersionFromRequest(ReportCreateOrUpdateRequest request, int versionNumber) {
        ReportVersion version = new ReportVersion();
        version.setVersionNumber(versionNumber);
        applyRequestToVersion(version, request);
        return version;
    }

    private void applyRequestToVersion(ReportVersion version, ReportCreateOrUpdateRequest request) {
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + request.projectId()));

        validateSingleKeyFlags(request);

        version.setProject(project);
        version.setTasksPlannedNextWeek(request.tasksPlannedNextWeek());
        version.setNotesOrLinks(request.notesOrLinks());

        version.getTaskEntries().clear();
        request.tasks().forEach(t -> {
            TaskEntry entry = new TaskEntry();
            entry.setReportVersion(version);
            entry.setTaskName(t.taskName());
            entry.setPriority(t.priority());
            entry.setPlannedPercent(t.plannedPercent());
            entry.setActualPercent(t.actualPercent());
            entry.setStatus(t.status());
            entry.setTimePlannedHours(t.timePlannedHours());
            entry.setTimeSpentHours(t.timeSpentHours());
            entry.setOutputDeliverable(t.outputDeliverable());
            version.getTaskEntries().add(entry);
        });

        version.getBlockers().clear();
        request.blockers().forEach(b -> {
            BlockerEntry entry = new BlockerEntry();
            entry.setReportVersion(version);
            entry.setDescription(b.description());
            entry.setKeyIssue(b.keyIssue());
            version.getBlockers().add(entry);
        });

        version.getAchievements().clear();
        request.achievements().forEach(a -> {
            AchievementEntry entry = new AchievementEntry();
            entry.setReportVersion(version);
            entry.setDescription(a.description());
            entry.setKeyAchievement(a.keyAchievement());
            version.getAchievements().add(entry);
        });

        version.getHoursBreakdown().clear();
        if (request.hoursBreakdown() != null) {
            request.hoursBreakdown().forEach(h -> {
                HoursByTaskType entry = new HoursByTaskType();
                entry.setReportVersion(version);
                entry.setTaskType(h.taskType());
                entry.setHours(h.hours());
                version.getHoursBreakdown().add(entry);
            });
        }
    }

    private void validateSingleKeyFlags(ReportCreateOrUpdateRequest request) {
        long keyIssueCount = request.blockers().stream().filter(BlockerEntryRequest::keyIssue).count();
        if (keyIssueCount > 1) {
            throw new IllegalStateException("Only one blocker can be flagged as the key issue");
        }
        long keyAchievementCount = request.achievements().stream().filter(AchievementEntryRequest::keyAchievement).count();
        if (keyAchievementCount > 1) {
            throw new IllegalStateException("Only one achievement can be flagged as the key achievement");
        }
    }

    private void validateVersionBeforeSubmit(ReportVersion version) {
        if (version.getTaskEntries().isEmpty()) {
            throw new IllegalStateException("Cannot submit a report with no tasks");
        }
    }
}
