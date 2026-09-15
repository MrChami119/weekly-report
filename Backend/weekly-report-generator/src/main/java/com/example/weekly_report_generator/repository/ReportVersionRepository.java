package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.ReportVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportVersionRepository extends JpaRepository<ReportVersion, Long> {
    List<ReportVersion> findByReportIdOrderByVersionNumberDesc(Long reportId);
    Optional<ReportVersion> findTopByReportIdOrderByVersionNumberDesc(Long reportId);
}
