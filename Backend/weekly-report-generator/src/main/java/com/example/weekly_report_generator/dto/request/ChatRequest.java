package com.example.weekly_report_generator.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank String question
) {}
