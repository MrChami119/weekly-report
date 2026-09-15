package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.HoursByTaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HoursByTaskTypeRepository extends JpaRepository<HoursByTaskType, Long> {
    List<HoursByTaskType> findByReportVersionId(Long reportVersionId);

    @Query("""
        SELECT h.taskType, SUM(h.hours)
        FROM HoursByTaskType h
        JOIN h.reportVersion rv
        JOIN rv.report r
        WHERE r.weekStartDate = :weekStart
        GROUP BY h.taskType
    """)
    List<Object[]> sumHoursByTaskTypeForWeek(@Param("weekStart") LocalDate weekStart);
}
