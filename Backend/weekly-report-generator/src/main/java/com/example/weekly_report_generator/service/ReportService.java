package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.request.ReportCreateOrUpdateRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;
import com.example.weekly_report_generator.dto.response.ReportSummaryResponse;
import com.example.weekly_report_generator.enums.ReportStatus;
import com.example.weekly_report_generator.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {
    ReportDetailResponse createDraft(Long userId, ReportCreateOrUpdateRequest request);
    ReportDetailResponse updateDraft(Long userId, Long reportId, ReportCreateOrUpdateRequest request);
    ReportDetailResponse submitReport(Long userId, Long reportId);
    ReportDetailResponse getReportDetail(Long reportId, Long requestingUserId, Role requestingUserRole);
    Page<ReportSummaryResponse> getMyReports(Long userId, ReportStatus statusFilter, Pageable pageable);
}
