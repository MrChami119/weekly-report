package com.example.weekly_report_generator.entity;

import com.example.weekly_report_generator.enums.Priority;
import com.example.weekly_report_generator.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_version_id", nullable = false)
    private ReportVersion reportVersion;

    private String taskName;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    private int plannedPercent;
    private int actualPercent;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private double timePlannedHours;
    private double timeSpentHours;

    @Column(columnDefinition = "TEXT")
    private String outputDeliverable;
}
