package com.example.weekly_report_generator.mapper;

import com.example.weekly_report_generator.dto.response.*;
import com.example.weekly_report_generator.entity.*;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
public class ReportMapper {

    public ReportSummaryResponse toSummaryResponse(Report report) {
        ReportVersion current = report.getCurrentVersion();
        return new ReportSummaryResponse(
                report.getId(),
                report.getUser().getId(),
                report.getUser().getFullName(),
                report.getWeekStartDate(),
                report.getWeekEndDate(),
                report.getStatus(),
                current != null && current.getProject() != null ? current.getProject().getName() : null,
                report.getUpdatedAt()
        );
    }

    public ReportDetailResponse toDetailResponse(Report report) {
        ReportVersion currentVersion = report.getCurrentVersion();

        List<ReportVersionResponse> pastVersions = report.getVersions().stream()
                .filter(v -> !v.getId().equals(currentVersion.getId()))
                .sorted(Comparator.comparingInt(ReportVersion::getVersionNumber).reversed())
                .map(this::toVersionResponse)
                .toList();

        return new ReportDetailResponse(
                report.getId(),
                report.getUser().getId(),
                report.getUser().getFullName(),
                report.getWeekStartDate(),
                report.getWeekEndDate(),
                report.getStatus(),
                toVersionResponse(currentVersion),
                pastVersions
        );
    }

    public ReportVersionResponse toVersionResponse(ReportVersion v) {
        ReviewCommentResponse commentResponse = null;
        if (v.getReviewComment() != null) {
            ReviewComment rc = v.getReviewComment();
            commentResponse = new ReviewCommentResponse(
                    rc.getId(),
                    rc.getAction(),
                    rc.getComment(),
                    rc.getReviewer().getFullName(),
                    rc.getReviewedAt()
            );
        }

        return new ReportVersionResponse(
                v.getId(),
                v.getVersionNumber(),
                v.getProject() != null ? v.getProject().getId() : null,
                v.getProject() != null ? v.getProject().getName() : null,
                v.getTaskEntries().stream().map(this::toTaskResponse).toList(),
                v.getBlockers().stream().map(this::toBlockerResponse).toList(),
                v.getAchievements().stream().map(this::toAchievementResponse).toList(),
                v.getHoursBreakdown().stream().map(this::toHoursResponse).toList(),
                v.getTasksPlannedNextWeek(),
                v.getNotesOrLinks(),
                v.getSubmittedAt(),
                commentResponse
        );
    }

    public TaskEntryResponse toTaskResponse(TaskEntry t) {
        return new TaskEntryResponse(
                t.getId(),
                t.getTaskName(),
                t.getPriority(),
                t.getPlannedPercent(),
                t.getActualPercent(),
                t.getStatus(),
                t.getTimePlannedHours(),
                t.getTimeSpentHours(),
                t.getOutputDeliverable()
        );
    }

    public BlockerEntryResponse toBlockerResponse(BlockerEntry b) {
        return new BlockerEntryResponse(b.getId(), b.getDescription(), b.isKeyIssue());
    }

    public AchievementEntryResponse toAchievementResponse(AchievementEntry a) {
        return new AchievementEntryResponse(a.getId(), a.getDescription(), a.isKeyAchievement());
    }

    public HoursByTaskTypeResponse toHoursResponse(HoursByTaskType h) {
        return new HoursByTaskTypeResponse(h.getId(), h.getTaskType(), h.getHours());
    }
}
