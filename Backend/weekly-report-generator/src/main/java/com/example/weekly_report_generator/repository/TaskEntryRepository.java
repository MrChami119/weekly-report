package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.TaskEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskEntryRepository extends JpaRepository<TaskEntry, Long> {
    List<TaskEntry> findByReportVersionId(Long reportVersionId);

    @Query("""
        SELECT p.name, COUNT(t)
        FROM TaskEntry t
        JOIN t.reportVersion rv
        JOIN rv.project p
        WHERE rv.submittedAt IS NOT NULL
        GROUP BY p.name
    """)
    List<Object[]> countTasksByProject();
}
