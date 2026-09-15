package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.response.UserResponse;
import com.example.weekly_report_generator.entity.User;
import com.example.weekly_report_generator.enums.Role;
import com.example.weekly_report_generator.exception.ResourceNotFoundException;
import com.example.weekly_report_generator.repository.UserRepository;
import com.example.weekly_report_generator.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public UserResponse updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setRole(newRole);
        return toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setEnabled(enabled);
        return toResponse(userRepository.save(user));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled());
    }
}
