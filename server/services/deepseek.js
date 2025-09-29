import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const deepseekClient = axios.create({
  baseURL: "https://api.deepseek.com",
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export const sendToDeepSeek = async (messages) => {
  const res = await deepseekClient.post("/chat/completions", {
    model: "deepseek-chat",
    messages,
    max_tokens: 100,
    temperature: 0.7,
    stream: false,
  });
  return res.data.choices[0].message.content;
};
