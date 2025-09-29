import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import TOPIC_PROMPTS from "./Data/Topic.js";

dotenv.config();

const app = express();
const allowedOrigins = ["http://localhost:5174","https://j7spfpsd-5174.inc1.devtunnels.ms"]; // Add your client URL here

// Middleware
app.use(cors({
  origin: allowedOrigins, 
  credentials: true
}));
app.use(express.json());

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';



// In-memory storage for conversation history (use database in production)
const conversationHistory = new Map();

// Logger middleware
app.use((req, _res, next) => {
  console.log(">>", req.method, req.originalUrl, req.body);
  next();
});

// Health check
app.get("/", (_req, res) => res.send("Chat API Server is running!"));

// Main chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, topic = "friend" } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get or create conversation history for this topic
    const historyKey = `topic_${topic}`;
    if (!conversationHistory.has(historyKey)) {
      conversationHistory.set(historyKey, []);
    }
    const history = conversationHistory.get(historyKey);

    // Add user message to history
    history.push({ role: "user", content: message });

    // Prepare messages for DeepSeek API
    const messages = [
      {
        role: "system",
        content: TOPIC_PROMPTS[topic] || TOPIC_PROMPTS.friend
      },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    console.log("Sending to DeepSeek:", { topic, messageCount: messages.length });

    const response = await axios.post(
      `${DEEPSEEK_BASE_URL}/chat/completions`,
      {
        model: "deepseek-chat",
        messages: messages,
        max_tokens: 100,
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const botReply = response.data.choices[0].message.content;

    // Add bot response to history
    history.push({ role: "assistant", content: botReply });

    // Limit history size to prevent memory issues
    if (history.length > 20) {
      conversationHistory.set(historyKey, history.slice(-10));
    }

    res.json({ 
      reply: botReply,
      topic: topic
    });

  } catch (error) {
    console.error("DeepSeek API error:", error.response?.data || error.message);
    
    let errorMessage = "Sorry, I'm having trouble responding right now. Please try again.";
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = "Unable to connect to the AI service. Please check your connection.";
    } else if (error.response?.status === 401) {
      errorMessage = "API authentication failed. Please check your API key.";
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please wait a moment before trying again.";
    }

    res.status(500).json({ 
      error: error.message,
      reply: errorMessage 
    });
  }
});

// Endpoint to clear conversation history
app.delete("/chat/history", (req, res) => {
  const { topic } = req.body;
  if (topic) {
    const historyKey = `topic_${topic}`;
    conversationHistory.delete(historyKey);
  } else {
    conversationHistory.clear();
  }
  res.json({ message: "Conversation history cleared" });
});

// Endpoint to get conversation history
app.get("/chat/history", (req, res) => {
  const { topic } = req.query;
  if (topic) {
    const historyKey = `topic_${topic}`;
    res.json({ history: conversationHistory.get(historyKey) || [] });
  } else {
    res.json({ 
      histories: Object.fromEntries(conversationHistory),
      totalTopics: conversationHistory.size 
    });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((error, _req, res, _next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Chat API Server running on http://${HOST}:${PORT}`);
  console.log(`📚 Available topics: ${Object.keys(TOPIC_PROMPTS).join(', ')}`);
});