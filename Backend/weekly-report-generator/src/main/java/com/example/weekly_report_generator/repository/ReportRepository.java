package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.Report;
import com.example.weekly_report_generator.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long>,
        JpaSpecificationExecutor<Report> {

    Optional<Report> findByUserIdAndWeekStartDate(Long userId, LocalDate weekStartDate);

    Page<Report> findByUserId(Long userId, Pageable pageable);

    Page<Report> findByUserIdAndStatus(Long userId, ReportStatus status, Pageable pageable);

    @Query("""
        SELECT r FROM Report r
        WHERE r.weekStartDate = :weekStart
    """)
    List<Report> findAllForWeek(@Param("weekStart") LocalDate weekStart);

    long countByStatus(ReportStatus status);

    @Query("""
        SELECT COUNT(r) FROM Report r
        WHERE r.weekStartDate = :weekStart AND r.status = :status
    """)
    long countByWeekAndStatus(@Param("weekStart") LocalDate weekStart,
                              @Param("status") ReportStatus status);
}
