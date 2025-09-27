import axios from "axios";

// const API_BASE = "http://localhost:5000";
const API_BASE = "";   
export const api = axios.create({ baseURL: API_BASE });

export async function sendToAssistant({ text, sender }) {
  const { data } = await api.post("/api/chat", { text, sender });
  return data; // { replyText, messages }
}

export async function health() {
  const { data } = await api.get("/api/health");
  return data;
}
