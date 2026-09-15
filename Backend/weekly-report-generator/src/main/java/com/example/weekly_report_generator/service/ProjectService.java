package com.example.weekly_report_generator.service;

import com.example.weekly_report_generator.dto.request.ProjectRequest;
import com.example.weekly_report_generator.dto.response.ProjectResponse;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllActiveProjects();
    List<ProjectResponse> getAllProjects();
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse updateProject(Long projectId, ProjectRequest request);
    void deactivateProject(Long projectId);
    void reactivateProject(Long projectId);
}
