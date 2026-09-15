package com.example.weekly_report_generator.dto.response;

public record DashboardMetricsResponse(
        long totalReportsSubmittedThisWeek,
        long pendingCount,
        long lateCount,
        long needsCorrectionCount,
        long openBlockersCount
) {}
