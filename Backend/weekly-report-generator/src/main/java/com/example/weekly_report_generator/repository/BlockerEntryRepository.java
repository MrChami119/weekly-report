package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.BlockerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BlockerEntryRepository extends JpaRepository<BlockerEntry, Long> {
    List<BlockerEntry> findByReportVersionId(Long reportVersionId);

    @Query("""
        SELECT COUNT(b) FROM BlockerEntry b
        JOIN b.reportVersion rv
        JOIN rv.report r
        WHERE r.weekStartDate = :weekStart
    """)
    long countOpenBlockersForWeek(@Param("weekStart") LocalDate weekStart);
}
