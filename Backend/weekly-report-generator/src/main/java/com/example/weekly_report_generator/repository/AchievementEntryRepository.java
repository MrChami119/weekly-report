package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.AchievementEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementEntryRepository extends JpaRepository<AchievementEntry, Long> {
    List<AchievementEntry> findByReportVersionId(Long reportVersionId);
}
