package com.example.weekly_report_generator.dto.response;

import com.example.weekly_report_generator.enums.Role;

public record AuthResponse(
        String token,
        Long userId,
        String fullName,
        String email,
        Role role
) {}
