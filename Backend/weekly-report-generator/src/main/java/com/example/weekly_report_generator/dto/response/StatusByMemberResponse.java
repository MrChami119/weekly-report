package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.ReportStatus;

public record StatusByMemberResponse(String userFullName, ReportStatus status) {}

