package com.example.weekly_report_generator.dto.response;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        boolean active
) {}
