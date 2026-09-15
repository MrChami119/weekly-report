package com.example.weekly_report_generator.dto.response;

import java.time.Instant;

public record ActivityFeedItemResponse(
        String userFullName,
        String action,
        Instant timestamp
) {}
