package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.Role;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        Role role,
        boolean enabled
) {}
