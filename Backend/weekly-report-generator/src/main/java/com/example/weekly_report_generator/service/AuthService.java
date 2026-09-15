package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.request.LoginRequest;
import com.example.weekly_report_generator.dto.request.RegisterRequest;
import com.example.weekly_report_generator.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
