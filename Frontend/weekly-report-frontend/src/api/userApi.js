import axiosClient from "./axiosClient";

export const getAllUsers = () => axiosClient.get("/admin/users");

export const updateUserRole = (userId, role) =>
  axiosClient.patch(`/admin/users/${userId}/role`, null, {
    params: { role },
  });

export const setUserEnabled = (userId, enabled) =>
  axiosClient.patch(`/admin/users/${userId}/status`, null, {
    params: { enabled },
  });
