package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.request.ReviewActionRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;
import com.example.weekly_report_generator.entity.Report;
import com.example.weekly_report_generator.entity.ReportVersion;
import com.example.weekly_report_generator.entity.ReviewComment;
import com.example.weekly_report_generator.entity.User;
import com.example.weekly_report_generator.enums.ReportStatus;
import com.example.weekly_report_generator.enums.ReviewAction;
import com.example.weekly_report_generator.exception.ResourceNotFoundException;
import com.example.weekly_report_generator.mapper.ReportMapper;
import com.example.weekly_report_generator.repository.ReportRepository;
import com.example.weekly_report_generator.repository.UserRepository;
import com.example.weekly_report_generator.service.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;

    @Override
    @Transactional
    public ReportDetailResponse reviewReport(Long managerId, Long reportId, ReviewActionRequest request) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + managerId));

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (report.getStatus() != ReportStatus.SUBMITTED) {
            throw new IllegalStateException("Only a SUBMITTED report can be reviewed");
        }

        if (request.action() == ReviewAction.CHANGES_REQUESTED
                && (request.comment() == null || request.comment().isBlank())) {
            throw new IllegalStateException("A comment is required when requesting changes");
        }

        ReportVersion current = report.getCurrentVersion();

        ReviewComment comment = new ReviewComment();
        comment.setReportVersion(current);
        comment.setReviewer(manager);
        comment.setAction(request.action());
        comment.setComment(request.comment());
        current.setReviewComment(comment);

        report.setStatus(request.action() == ReviewAction.APPROVED
                ? ReportStatus.APPROVED
                : ReportStatus.NEEDS_CORRECTION);

        Report saved = reportRepository.save(report);
        return reportMapper.toDetailResponse(saved);
    }
}
