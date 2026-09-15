package com.example.weekly_report_generator.dto.response;

import java.time.LocalDate;

public record TaskTrendPoint(LocalDate weekStartDate, long tasksCompleted) {}

