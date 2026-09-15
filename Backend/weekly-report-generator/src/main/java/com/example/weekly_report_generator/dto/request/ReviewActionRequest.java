package com.example.weekly_report_generator.dto.request;

import com.example.weekly_report_generator.enums.ReviewAction;
import jakarta.validation.constraints.NotNull;

public record ReviewActionRequest(
        @NotNull ReviewAction action,
        String comment
) {}
