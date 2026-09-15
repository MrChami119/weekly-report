package com.example.weekly_report_generator.dto.response;

import java.time.Instant;
import java.util.List;

public record ReportVersionResponse(
        Long id,
        int versionNumber,
        Long projectId,
        String projectName,
        List<TaskEntryResponse> tasks,
        List<BlockerEntryResponse> blockers,
        List<AchievementEntryResponse> achievements,
        List<HoursByTaskTypeResponse> hoursBreakdown,
        String tasksPlannedNextWeek,
        String notesOrLinks,
        Instant submittedAt,
        ReviewCommentResponse reviewComment
) {}
