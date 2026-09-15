import axiosClient from "./axiosClient";

export const askAssistant = (question) =>
  axiosClient.post("/manager/chat/ask", { question });
