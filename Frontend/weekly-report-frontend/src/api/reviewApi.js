import axiosClient from "./axiosClient";

export const reviewReport = (reportId, action, comment) =>
  axiosClient.post(`/manager/reports/${reportId}/review`, { action, comment });
