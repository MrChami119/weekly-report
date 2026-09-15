package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.TaskStatus;
import com.example.weekly_report_generator.enums.Priority;

public record TaskEntryResponse(
        Long id, String taskName, Priority priority,
        int plannedPercent, int actualPercent, TaskStatus status,
        double timePlannedHours, double timeSpentHours, String outputDeliverable
) {}
