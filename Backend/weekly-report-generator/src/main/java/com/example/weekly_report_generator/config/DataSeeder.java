package com.example.weekly_report_generator.config;

import com.example.weekly_report_generator.entity.*;
import com.example.weekly_report_generator.enums.*;
import com.example.weekly_report_generator.repository.ProjectRepository;
import com.example.weekly_report_generator.repository.ReportRepository;
import com.example.weekly_report_generator.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Data already seeded, skipping.");
            return;
        }

        log.info("Seeding database...");

        // ---------- Users ----------
        User manager = createUser("manager@company.com", "Manager One", Role.MANAGER);
        User admin = createUser("admin@company.com", "Admin One", Role.ADMIN);
        User alice = createUser("alice@company.com", "Alice Johnson", Role.TEAM_MEMBER);
        User bob = createUser("bob@company.com", "Bob Smith", Role.TEAM_MEMBER);
        User carol = createUser("carol@company.com", "Carol Davis", Role.TEAM_MEMBER);
        User dave = createUser("dave@company.com", "Dave Wilson", Role.TEAM_MEMBER);

        // ---------- Projects ----------
        Project clientA = createProject("Client A", "Work for Client A engagement");
        Project internalTooling = createProject("Internal Tooling", "Internal dev tools and automation");
        Project rnd = createProject("R&D", "Research and prototyping");
        Project marketing = createProject("Marketing", "Marketing site and campaigns");

        // ---------- Reports across several weeks, different statuses ----------
        LocalDate week1 = LocalDate.now().minusWeeks(3).with(DayOfWeek.MONDAY);
        LocalDate week2 = LocalDate.now().minusWeeks(2).with(DayOfWeek.MONDAY);
        LocalDate week3 = LocalDate.now().minusWeeks(1).with(DayOfWeek.MONDAY);

        // Alice: week1 approved, week2 needs correction (with a stale v1 + edited v2), week3 draft
        seedApprovedReport(alice, clientA, week1, manager);
        seedNeedsCorrectionReport(alice, internalTooling, week2, manager);
        seedDraftReport(alice, rnd, week3);

        // Bob: week1 submitted (awaiting review), week2 approved
        seedSubmittedReport(bob, marketing, week1);
        seedApprovedReport(bob, clientA, week2, manager);

        // Carol: week1 approved, week3 submitted
        seedApprovedReport(carol, rnd, week1, manager);
        seedSubmittedReport(carol, internalTooling, week3);

        // Dave: no report at all for week3 (shows up as "not started" on dashboard), week1 approved
        seedApprovedReport(dave, marketing, week1, manager);

        log.info("Seeding complete.");
        log.info("Login as manager: manager@company.com / password123");
        log.info("Login as admin: admin@company.com / password123");
        log.info("Login as team member: alice@company.com / password123 (etc.)");
    }

    // ---------- helpers ----------

    private User createUser(String email, String fullName, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setFullName(fullName);
        user.setRole(role);
        user.setEnabled(true);
        return userRepository.save(user);
    }

    private Project createProject(String name, String description) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setActive(true);
        return projectRepository.save(project);
    }

    private ReportVersion buildVersion(int versionNumber, Project project) {
        ReportVersion v = new ReportVersion();
        v.setVersionNumber(versionNumber);
        v.setProject(project);
        v.setTasksPlannedNextWeek("Continue ongoing tasks and start next sprint items.");
        v.setNotesOrLinks("");

        TaskEntry t1 = new TaskEntry();
        t1.setReportVersion(v);
        t1.setTaskName("Implement feature X");
        t1.setPriority(Priority.HIGH);
        t1.setPlannedPercent(100);
        t1.setActualPercent(80);
        t1.setStatus(TaskStatus.IN_PROGRESS);
        t1.setTimePlannedHours(20);
        t1.setTimeSpentHours(18);
        t1.setOutputDeliverable("PR #123");
        v.getTaskEntries().add(t1);

        TaskEntry t2 = new TaskEntry();
        t2.setReportVersion(v);
        t2.setTaskName("Fix bug in module Y");
        t2.setPriority(Priority.MEDIUM);
        t2.setPlannedPercent(100);
        t2.setActualPercent(100);
        t2.setStatus(TaskStatus.COMPLETED);
        t2.setTimePlannedHours(5);
        t2.setTimeSpentHours(4);
        t2.setOutputDeliverable("PR #124");
        v.getTaskEntries().add(t2);

        BlockerEntry blocker = new BlockerEntry();
        blocker.setReportVersion(v);
        blocker.setDescription("Waiting on API access from third-party vendor");
        blocker.setKeyIssue(true);
        v.getBlockers().add(blocker);

        AchievementEntry achievement = new AchievementEntry();
        achievement.setReportVersion(v);
        achievement.setDescription("Shipped feature X to staging");
        achievement.setKeyAchievement(true);
        v.getAchievements().add(achievement);

        HoursByTaskType dev = new HoursByTaskType();
        dev.setReportVersion(v);
        dev.setTaskType(TaskType.DEVELOPMENT);
        dev.setHours(18);
        v.getHoursBreakdown().add(dev);

        HoursByTaskType meetings = new HoursByTaskType();
        meetings.setReportVersion(v);
        meetings.setTaskType(TaskType.MEETINGS);
        meetings.setHours(4);
        v.getHoursBreakdown().add(meetings);

        return v;
    }

    private Report buildReportShell(User user, LocalDate weekStart) {
        Report report = new Report();
        report.setUser(user);
        report.setWeekStartDate(weekStart);
        report.setWeekEndDate(weekStart.plusDays(4));
        return report;
    }

    private void seedDraftReport(User user, Project project, LocalDate weekStart) {
        Report report = buildReportShell(user, weekStart);
        report.setStatus(ReportStatus.DRAFT);
        ReportVersion v1 = buildVersion(1, project);
        v1.setReport(report);
        report.getVersions().add(v1);

        reportRepository.save(report);
    }

    private void seedSubmittedReport(User user, Project project, LocalDate weekStart) {
        Report report = buildReportShell(user, weekStart);
        report.setStatus(ReportStatus.SUBMITTED);
        ReportVersion v1 = buildVersion(1, project);
        v1.setReport(report);
        v1.setSubmittedAt(Instant.now().minus(2, ChronoUnit.DAYS));
        report.getVersions().add(v1);

        reportRepository.save(report);
    }

    private void seedApprovedReport(User user, Project project, LocalDate weekStart, User manager) {
        Report report = buildReportShell(user, weekStart);
        report.setStatus(ReportStatus.APPROVED);
        ReportVersion v1 = buildVersion(1, project);
        v1.setReport(report);
        v1.setSubmittedAt(Instant.now().minus(5, ChronoUnit.DAYS));

        ReviewComment approval = new ReviewComment();
        approval.setReportVersion(v1);
        approval.setReviewer(manager);
        approval.setAction(ReviewAction.APPROVED);
        approval.setComment(null);
        v1.setReviewComment(approval);

        report.getVersions().add(v1);

        reportRepository.save(report);
    }

    private void seedNeedsCorrectionReport(User user, Project project, LocalDate weekStart, User manager) {
        Report report = buildReportShell(user, weekStart);

        // version 1: submitted, then rejected — stays frozen with its comment
        ReportVersion v1 = buildVersion(1, project);
        v1.setReport(report);
        v1.setSubmittedAt(Instant.now().minus(6, ChronoUnit.DAYS));

        ReviewComment rejection = new ReviewComment();
        rejection.setReportVersion(v1);
        rejection.setReviewer(manager);
        rejection.setAction(ReviewAction.CHANGES_REQUESTED);
        rejection.setComment("Please add more detail on the vendor blocker and update actual % for task 1.");
        v1.setReviewComment(rejection);

        report.getVersions().add(v1);

        ReportVersion v2 = buildVersion(2, project);
        v2.setReport(report);
        report.getVersions().add(v2);


        report.setStatus(ReportStatus.NEEDS_CORRECTION);

        reportRepository.save(report);
    }
}
