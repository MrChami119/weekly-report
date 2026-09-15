package com.example.weekly_report_generator.repository;

import com.example.weekly_report_generator.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByNameIgnoreCase(String name);
    List<Project> findByActiveTrue();
}
