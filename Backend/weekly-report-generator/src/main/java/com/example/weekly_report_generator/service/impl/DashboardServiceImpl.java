package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.response.*;
import com.example.weekly_report_generator.entity.Report;
import com.example.weekly_report_generator.enums.*;
import com.example.weekly_report_generator.mapper.ReportMapper;
import com.example.weekly_report_generator.repository.*;
import com.example.weekly_report_generator.repository.spec.ReportSpecifications;
import com.example.weekly_report_generator.service.DashboardService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ReportRepository reportRepository;
    private final TaskEntryRepository taskEntryRepository;
    private final BlockerEntryRepository blockerEntryRepository;
    private final HoursByTaskTypeRepository hoursByTaskTypeRepository;
    private final ReviewCommentRepository reviewCommentRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ReportSummaryResponse> filterReports(
            Long userId, Long projectId, LocalDate weekStart, LocalDate weekEnd,
            ReportStatus status, Pageable pageable) {

        Specification<Report> spec = ReportSpecifications.withFilters(userId, projectId, weekStart, weekEnd, status);
        return reportRepository.findAll(spec, pageable).map(reportMapper::toSummaryResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardMetricsResponse getMetrics(LocalDate weekStart) {
        long submitted = reportRepository.countByWeekAndStatus(weekStart, ReportStatus.SUBMITTED)
                + reportRepository.countByWeekAndStatus(weekStart, ReportStatus.APPROVED)
                + reportRepository.countByWeekAndStatus(weekStart, ReportStatus.NEEDS_CORRECTION);

        long totalActiveUsers = userRepository.findByRole(Role.TEAM_MEMBER).size();
        long reportsStartedThisWeek = reportRepository.findAllForWeek(weekStart).size();
        long pending = totalActiveUsers - reportsStartedThisWeek; // no report row at all yet = not started
        long needsCorrection = reportRepository.countByWeekAndStatus(weekStart, ReportStatus.NEEDS_CORRECTION);

        long late = weekStart.isBefore(LocalDate.now().minusDays(7))
                ? reportRepository.countByWeekAndStatus(weekStart, ReportStatus.DRAFT)
                : 0;

        long openBlockers = blockerEntryRepository.countOpenBlockersForWeek(weekStart);

        return new DashboardMetricsResponse(submitted, Math.max(pending, 0), late, needsCorrection, openBlockers);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskTrendPoint> getTaskCompletionTrend(Long userId) {
        List<Report> reports = (userId != null)
                ? reportRepository.findByUserId(userId, Pageable.unpaged()).getContent()
                : reportRepository.findAll();

        return reports.stream()
                .filter(r -> r.getCurrentVersion() != null)
                .collect(Collectors.groupingBy(
                        Report::getWeekStartDate,
                        Collectors.summingLong(r -> r.getCurrentVersion().getTaskEntries().stream()
                                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                                .count())
                ))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new TaskTrendPoint(e.getKey(), e.getValue()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatusByMemberResponse> getStatusByMember(LocalDate weekStart) {
        return reportRepository.findAllForWeek(weekStart).stream()
                .map(r -> new StatusByMemberResponse(r.getUser().getFullName(), r.getStatus()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectWorkloadResponse> getWorkloadByProject() {
        return taskEntryRepository.countTasksByProject().stream()
                .map(row -> new ProjectWorkloadResponse((String) row[0], (Long) row[1]))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HoursByTaskTypeChartResponse> getHoursByTaskType(LocalDate weekStart) {
        return hoursByTaskTypeRepository.sumHoursByTaskTypeForWeek(weekStart).stream()
                .map(row -> new HoursByTaskTypeChartResponse((TaskType) row[0], (Double) row[1]))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityFeedItemResponse> getRecentActivity(int limit) {
        return reviewCommentRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "reviewedAt")))
                .stream()
                .map(rc -> new ActivityFeedItemResponse(
                        rc.getReportVersion().getReport().getUser().getFullName(),
                        rc.getAction() == ReviewAction.APPROVED ? "Approved" : "Sent back for correction",
                        rc.getReviewedAt()
                ))
                .toList();
    }
}
