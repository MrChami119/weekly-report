package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.request.ReportCreateOrUpdateRequest;
import com.example.weekly_report_generator.dto.response.ReportDetailResponse;
import com.example.weekly_report_generator.entity.Report;
import com.example.weekly_report_generator.entity.User;
import com.example.weekly_report_generator.enums.ReportStatus;
import com.example.weekly_report_generator.enums.Role;
import com.example.weekly_report_generator.exception.ResourceNotFoundException;
import com.example.weekly_report_generator.mapper.ReportMapper;
import com.example.weekly_report_generator.repository.ProjectRepository;
import com.example.weekly_report_generator.repository.ReportRepository;
import com.example.weekly_report_generator.repository.ReportVersionRepository;
import com.example.weekly_report_generator.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {

    @Mock private ReportRepository reportRepository;
    @Mock private ReportVersionRepository reportVersionRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private UserRepository userRepository;
    @Mock private ReportMapper reportMapper;

    @InjectMocks
    private ReportServiceImpl reportService;

    private User owner;
    private User otherTeamMember;
    private User manager;
    private Report report;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setRole(Role.TEAM_MEMBER);
        owner.setFullName("Alice Owner");

        otherTeamMember = new User();
        otherTeamMember.setId(2L);
        otherTeamMember.setRole(Role.TEAM_MEMBER);
        otherTeamMember.setFullName("Bob Other");

        manager = new User();
        manager.setId(3L);
        manager.setRole(Role.MANAGER);
        manager.setFullName("Manager One");

        report = new Report();
        report.setId(100L);
        report.setUser(owner);
        report.setStatus(ReportStatus.DRAFT);
        report.setVersions(new ArrayList<>());
    }

    @Test
    void ownerCanAccessTheirOwnReport() {
        when(reportRepository.findById(100L)).thenReturn(Optional.of(report));
        when(reportMapper.toDetailResponse(report)).thenReturn(mock(ReportDetailResponse.class));

        assertDoesNotThrow(() ->
                reportService.getReportDetail(100L, owner.getId(), owner.getRole()));
    }

    @Test
    void managerCanAccessAnyTeamMembersReport() {
        when(reportRepository.findById(100L)).thenReturn(Optional.of(report));
        when(reportMapper.toDetailResponse(report)).thenReturn(mock(ReportDetailResponse.class));

        assertDoesNotThrow(() ->
                reportService.getReportDetail(100L, manager.getId(), manager.getRole()));
    }

    @Test
    void otherTeamMemberCannotAccessSomeoneElsesReport() {
        when(reportRepository.findById(100L)).thenReturn(Optional.of(report));

        assertThrows(AccessDeniedException.class, () ->
                reportService.getReportDetail(100L, otherTeamMember.getId(), otherTeamMember.getRole()));
    }

    @Test
    void otherTeamMemberCannotEditSomeoneElsesReport() {
        when(reportRepository.findById(100L)).thenReturn(Optional.of(report));

        ReportCreateOrUpdateRequest request = new ReportCreateOrUpdateRequest(
                LocalDate.now(), LocalDate.now().plusDays(4), 1L,
                List.of(), List.of(), List.of(), List.of(), "", ""
        );

        assertThrows(AccessDeniedException.class, () ->
                reportService.updateDraft(otherTeamMember.getId(), 100L, request));
    }

    @Test
    void otherTeamMemberCannotSubmitSomeoneElsesReport() {
        when(reportRepository.findById(100L)).thenReturn(Optional.of(report));

        assertThrows(AccessDeniedException.class, () ->
                reportService.submitReport(otherTeamMember.getId(), 100L));
    }

    @Test
    void accessingNonExistentReportThrowsNotFound() {
        when(reportRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                reportService.getReportDetail(999L, owner.getId(), owner.getRole()));
    }
}
