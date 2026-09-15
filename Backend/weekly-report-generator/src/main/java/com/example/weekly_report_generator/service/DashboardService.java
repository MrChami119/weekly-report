package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.response.*;
import com.example.weekly_report_generator.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface DashboardService {
    Page<ReportSummaryResponse> filterReports(
            Long userId, Long projectId, LocalDate weekStart, LocalDate weekEnd,
            ReportStatus status, Pageable pageable);

    DashboardMetricsResponse getMetrics(LocalDate weekStart);
    List<TaskTrendPoint> getTaskCompletionTrend(Long userId);
    List<StatusByMemberResponse> getStatusByMember(LocalDate weekStart);
    List<ProjectWorkloadResponse> getWorkloadByProject();
    List<HoursByTaskTypeChartResponse> getHoursByTaskType(LocalDate weekStart);
    List<ActivityFeedItemResponse> getRecentActivity(int limit);
}
