package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.TaskType;

public record HoursByTaskTypeResponse(Long id, TaskType taskType, double hours) {}
