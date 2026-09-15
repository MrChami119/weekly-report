package com.example.weekly_report_generator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    private int versionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(columnDefinition = "TEXT")
    private String tasksPlannedNextWeek;

    @Column(columnDefinition = "TEXT")
    private String notesOrLinks;

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TaskEntry> taskEntries = new ArrayList<>();

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlockerEntry> blockers = new ArrayList<>();

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AchievementEntry> achievements = new ArrayList<>();

    @OneToMany(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HoursByTaskType> hoursBreakdown = new ArrayList<>();

    @OneToOne(mappedBy = "reportVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    private ReviewComment reviewComment;

    @CreationTimestamp
    private Instant submittedAt;
}