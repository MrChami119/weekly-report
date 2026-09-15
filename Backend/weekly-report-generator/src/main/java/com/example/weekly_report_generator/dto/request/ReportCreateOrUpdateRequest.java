package com.example.weekly_report_generator.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record ReportCreateOrUpdateRequest(
        @NotNull LocalDate weekStartDate,
        @NotNull LocalDate weekEndDate,
        @NotNull Long projectId,

        @Valid List<TaskEntryRequest> tasks,
        @Valid List<BlockerEntryRequest> blockers,
        @Valid List<AchievementEntryRequest> achievements,
        @Valid List<HoursByTaskTypeRequest> hoursBreakdown,

        String tasksPlannedNextWeek,
        String notesOrLinks
) {}
