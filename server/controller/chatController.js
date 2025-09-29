import TOPIC_PROMPTS from "../Data/Topic.js";
import { getHistory, setHistory, clearHistory, getAllHistories } from "../utils/conversationStore.js";
import { sendToDeepSeek } from "../services/deepseek.js";

export const chatHandler = async (req, res) => {
  try {
    const { message, topic = "friend" } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

    const history = getHistory(topic);
    history.push({ role: "user", content: message });

    const messages = [
      { role: "system", content: TOPIC_PROMPTS[topic] || TOPIC_PROMPTS.friend },
      ...history.slice(-10),
      { role: "user", content: message },
    ];

    const botReply = await sendToDeepSeek(messages);
    history.push({ role: "assistant", content: botReply });

    if (history.length > 20) setHistory(topic, history.slice(-10));

    res.json({ reply: botReply, topic });
  } catch (err) {
    console.error("DeepSeek API error:", err.response?.data || err.message);
    let msg = "Sorry, I'm having trouble responding right now.";
    if (err.response?.status === 401) msg = "Invalid API key.";
    if (err.response?.status === 429) msg = "Too many requests, try later.";
    if (err.code === "ECONNREFUSED") msg = "Cannot connect to AI service.";
    res.status(500).json({ error: err.message, reply: msg });
  }
};

export const clearHistoryHandler = (req, res) => {
  clearHistory(req.body.topic);
  res.json({ message: "Conversation history cleared" });
};

export const getHistoryHandler = (req, res) => {
  const { topic } = req.query;
  if (topic) {
    res.json({ history: getHistory(topic) || [] });
  } else {
    const all = getAllHistories();
    res.json({ histories: Object.fromEntries(all), totalTopics: all.size });
  }
};
