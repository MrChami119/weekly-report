package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.ReviewAction;

import java.time.Instant;

public record ReviewCommentResponse(
        Long id,
        ReviewAction action,
        String comment,
        String reviewerName,
        Instant reviewedAt
) {}
