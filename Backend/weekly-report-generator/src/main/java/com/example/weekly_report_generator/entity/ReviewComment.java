package com.example.weekly_report_generator.entity;

import com.example.weekly_report_generator.enums.ReviewAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_version_id", nullable = false, unique = true)
    private ReportVersion reportVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Enumerated(EnumType.STRING)
    private ReviewAction action;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    private Instant reviewedAt;
}
