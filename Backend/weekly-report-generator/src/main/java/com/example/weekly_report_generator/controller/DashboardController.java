package com.example.weekly_report_generator.controller;

import com.example.weekly_report_generator.dto.response.*;
import com.example.weekly_report_generator.enums.ReportStatus;
import com.example.weekly_report_generator.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/manager/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportSummaryResponse>> filterReports(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekEnd,
            @RequestParam(required = false) ReportStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(
                dashboardService.filterReports(userId, projectId, weekStart, weekEnd, status, pageable));
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsResponse> getMetrics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(dashboardService.getMetrics(weekStart));
    }

    @GetMapping("/charts/task-trend")
    public ResponseEntity<List<TaskTrendPoint>> getTaskTrend(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(dashboardService.getTaskCompletionTrend(userId));
    }

    @GetMapping("/charts/status-by-member")
    public ResponseEntity<List<StatusByMemberResponse>> getStatusByMember(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(dashboardService.getStatusByMember(weekStart));
    }

    @GetMapping("/charts/workload-by-project")
    public ResponseEntity<List<ProjectWorkloadResponse>> getWorkload() {
        return ResponseEntity.ok(dashboardService.getWorkloadByProject());
    }

    @GetMapping("/charts/hours-by-task-type")
    public ResponseEntity<List<HoursByTaskTypeChartResponse>> getHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        return ResponseEntity.ok(dashboardService.getHoursByTaskType(weekStart));
    }

    @GetMapping("/activity-feed")
    public ResponseEntity<List<ActivityFeedItemResponse>> getActivity(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentActivity(limit));
    }
}
