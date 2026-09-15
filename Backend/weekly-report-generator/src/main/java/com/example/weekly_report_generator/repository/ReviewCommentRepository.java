package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.ReviewComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewCommentRepository extends JpaRepository<ReviewComment, Long> {
    Optional<ReviewComment> findByReportVersionId(Long reportVersionId);

    @Query("""
        SELECT rc FROM ReviewComment rc
        JOIN rc.reportVersion rv
        JOIN rv.report r
        WHERE r.id = :reportId
        ORDER BY rc.reviewedAt DESC
    """)
    List<ReviewComment> findAllForReportOrderedByDate(@Param("reportId") Long reportId);
}