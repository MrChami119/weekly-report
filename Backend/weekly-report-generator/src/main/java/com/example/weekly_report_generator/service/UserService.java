package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.response.UserResponse;
import com.example.weekly_report_generator.enums.Role;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse updateUserRole(Long userId, Role newRole);
    UserResponse setUserEnabled(Long userId, boolean enabled);
}
