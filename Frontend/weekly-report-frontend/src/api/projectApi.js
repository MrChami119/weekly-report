import axiosClient from "./axiosClient";

export const getActiveProjects = () => axiosClient.get("/projects");

export const getAllProjects = () => axiosClient.get("/projects/all");

export const createProject = (data) => axiosClient.post("/projects", data);

export const updateProject = (projectId, data) =>
  axiosClient.put(`/projects/${projectId}`, data);

export const deactivateProject = (projectId) =>
  axiosClient.patch(`/projects/${projectId}/deactivate`);

export const reactivateProject = (projectId) =>
  axiosClient.patch(`/projects/${projectId}/reactivate`);
