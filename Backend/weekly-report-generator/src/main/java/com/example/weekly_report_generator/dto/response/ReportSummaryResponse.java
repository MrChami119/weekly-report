package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.ReportStatus;

import java.time.Instant;
import java.time.LocalDate;

public record ReportSummaryResponse(
        Long id,
        Long userId,
        String userFullName,
        LocalDate weekStartDate,
        LocalDate weekEndDate,
        ReportStatus status,
        String projectName,
        Instant lastUpdatedAt
) {}