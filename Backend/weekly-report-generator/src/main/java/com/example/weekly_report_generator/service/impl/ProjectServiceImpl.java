package com.example.weekly_report_generator.service.impl;

import com.example.weekly_report_generator.dto.request.ProjectRequest;
import com.example.weekly_report_generator.dto.response.ProjectResponse;
import com.example.weekly_report_generator.entity.Project;
import com.example.weekly_report_generator.exception.ResourceNotFoundException;
import com.example.weekly_report_generator.repository.ProjectRepository;
import com.example.weekly_report_generator.service.ProjectService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllActiveProjects() {
        return projectRepository.findByActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        projectRepository.findByNameIgnoreCase(request.name())
                .ifPresent(p -> { throw new IllegalStateException("A project with this name already exists"); });

        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setActive(true);

        return toResponse(projectRepository.save(project));
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        projectRepository.findByNameIgnoreCase(request.name())
                .filter(p -> !p.getId().equals(projectId))
                .ifPresent(p -> { throw new IllegalStateException("A project with this name already exists"); });

        project.setName(request.name());
        project.setDescription(request.description());

        return toResponse(projectRepository.save(project));
    }

    @Override
    @Transactional
    public void deactivateProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
        project.setActive(false);
        projectRepository.save(project);
    }

    @Override
    @Transactional
    public void reactivateProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
        project.setActive(true);
        projectRepository.save(project);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(project.getId(), project.getName(), project.getDescription(), project.isActive());
    }
}
