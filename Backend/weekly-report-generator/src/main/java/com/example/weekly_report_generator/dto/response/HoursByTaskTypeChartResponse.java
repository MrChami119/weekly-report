package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.TaskType;

public record HoursByTaskTypeChartResponse(TaskType taskType, double totalHours) {}

