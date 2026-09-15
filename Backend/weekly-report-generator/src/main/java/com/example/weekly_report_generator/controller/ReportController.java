package com.example.weekly_report_generator.controller;

import com.example.weekly_report_generator.dto.request.ReportCreateOrUpdateRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;
import com.example.weekly_report_generator.dto.response.ReportSummaryResponse;
import com.example.weekly_report_generator.enums.ReportStatus;
import com.example.weekly_report_generator.security.CustomUserDetails;
import com.example.weekly_report_generator.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportDetailResponse> createDraft(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ReportCreateOrUpdateRequest request) {
        return ResponseEntity.ok(reportService.createDraft(principal.getId(), request));
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<ReportDetailResponse> updateDraft(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long reportId,
            @Valid @RequestBody ReportCreateOrUpdateRequest request) {
        return ResponseEntity.ok(reportService.updateDraft(principal.getId(), reportId, request));
    }

    @PostMapping("/{reportId}/submit")
    public ResponseEntity<ReportDetailResponse> submit(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(reportService.submitReport(principal.getId(), reportId));
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDetailResponse> getReport(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long reportId) {
        return ResponseEntity.ok(reportService.getReportDetail(
                reportId, principal.getId(), principal.getUser().getRole()));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<ReportSummaryResponse>> getMyReports(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) ReportStatus status,
            @PageableDefault(size = 10, sort = "weekStartDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(reportService.getMyReports(principal.getId(), status, pageable));
    }
}
