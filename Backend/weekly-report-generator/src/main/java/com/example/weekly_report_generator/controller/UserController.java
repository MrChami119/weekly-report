package com.example.weekly_report_generator.controller;

import com.example.weekly_report_generator.dto.response.UserResponse;
import com.example.weekly_report_generator.enums.Role;
import com.example.weekly_report_generator.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<UserResponse> updateRole(
            @PathVariable Long userId, @RequestParam Role role) {
        return ResponseEntity.ok(userService.updateUserRole(userId, role));
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<UserResponse> setEnabled(
            @PathVariable Long userId, @RequestParam boolean enabled) {
        return ResponseEntity.ok(userService.setUserEnabled(userId, enabled));
    }
}