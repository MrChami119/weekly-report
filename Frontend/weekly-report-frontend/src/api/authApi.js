import axiosClient from "./axiosClient";

export const login = (email, password) =>
  axiosClient.post("/auth/login", { email, password });

export const register = (email, password, fullName) =>
  axiosClient.post("/auth/register", {
    email,
    password,
    fullName,
    role: "TEAM_MEMBER",
  });
