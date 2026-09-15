package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.request.ReviewActionRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;

public interface ReviewService {
    ReportDetailResponse reviewReport(Long managerId, Long reportId, ReviewActionRequest request);
}
