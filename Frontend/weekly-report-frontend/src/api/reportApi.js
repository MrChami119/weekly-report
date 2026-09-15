import axiosClient from "./axiosClient";

export const createDraft = (data) => axiosClient.post("/reports", data);

export const updateDraft = (reportId, data) =>
  axiosClient.put(`/reports/${reportId}`, data);

export const submitReport = (reportId) =>
  axiosClient.post(`/reports/${reportId}/submit`);

export const getReportDetail = (reportId) =>
  axiosClient.get(`/reports/${reportId}`);

export const getMyReports = (status, page = 0, size = 10) =>
  axiosClient.get("/reports/me", {
    params: { status: status || undefined, page, size },
  });
