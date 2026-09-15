package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.ReportStatus;

import java.time.LocalDate;
import java.util.List;

public record ReportDetailResponse(
        Long id,
        Long userId,
        String userFullName,
        LocalDate weekStartDate,
        LocalDate weekEndDate,
        ReportStatus status,
        ReportVersionResponse currentVersion,
        List<ReportVersionResponse> pastVersions
) {}
