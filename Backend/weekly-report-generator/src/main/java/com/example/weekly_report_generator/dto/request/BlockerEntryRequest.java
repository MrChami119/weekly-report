package com.example.weekly_report_generator.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BlockerEntryRequest(
        @NotBlank String description,
        boolean keyIssue
) {}
