import axiosClient from "./axiosClient";

export const filterReports = (filters, page = 0, size = 20) =>
  axiosClient.get("/manager/dashboard/reports", {
    params: { ...filters, page, size },
  });

export const getMetrics = (weekStart) =>
  axiosClient.get("/manager/dashboard/metrics", { params: { weekStart } });

export const getTaskTrend = (userId) =>
  axiosClient.get("/manager/dashboard/charts/task-trend", {
    params: { userId: userId || undefined },
  });

export const getStatusByMember = (weekStart) =>
  axiosClient.get("/manager/dashboard/charts/status-by-member", {
    params: { weekStart },
  });

export const getWorkloadByProject = () =>
  axiosClient.get("/manager/dashboard/charts/workload-by-project");

export const getHoursByTaskType = (weekStart) =>
  axiosClient.get("/manager/dashboard/charts/hours-by-task-type", {
    params: { weekStart },
  });

export const getActivityFeed = (limit = 10) =>
  axiosClient.get("/manager/dashboard/activity-feed", { params: { limit } });
