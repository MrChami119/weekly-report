package com.example.weekly_report_generator.controller;

import com.example.weekly_report_generator.dto.request.ReviewActionRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;
import com.example.weekly_report_generator.security.CustomUserDetails;
import com.example.weekly_report_generator.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{reportId}/review")
    public ResponseEntity<ReportDetailResponse> review(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long reportId,
            @Valid @RequestBody ReviewActionRequest request) {
        return ResponseEntity.ok(reviewService.reviewReport(principal.getId(), reportId, request));
    }
}
