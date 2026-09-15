package com.example.weekly_report_generator.dto.request;

import com.example.weekly_report_generator.enums.TaskStatus;
import jakarta.validation.constraints.*;
import com.example.weekly_report_generator.enums.Priority;

public record TaskEntryRequest(
        @NotBlank String taskName,
        @NotNull Priority priority,
        @Min(0) @Max(100) int plannedPercent,
        @Min(0) @Max(100) int actualPercent,
        @NotNull TaskStatus status,
        @PositiveOrZero double timePlannedHours,
        @PositiveOrZero double timeSpentHours,
        String outputDeliverable
) {}
