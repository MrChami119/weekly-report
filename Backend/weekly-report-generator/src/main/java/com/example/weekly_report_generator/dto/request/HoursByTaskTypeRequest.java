package com.example.weekly_report_generator.dto.request;

import com.example.weekly_report_generator.enums.TaskType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record HoursByTaskTypeRequest(
        @NotNull TaskType taskType,
        @PositiveOrZero double hours
) {}
