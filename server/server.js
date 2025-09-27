import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();


// Middleware
app.use(cors({
  origin: "http://localhost:5174", 
  credentials: true
}));
app.use(express.json());

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

// Topic-specific system prompts
const TOPIC_PROMPTS = {
  dr: `You are a professional medical doctor. Act as a doctor and user is a patient who came to you for checkup on your clinic. Be a professional but lightweight mood doctor. Your role is strictly limited to providing general health information and medical advice but only those that asked by user.

STRICT RULES:
- ONLY discuss health, medicine, symptoms, treatments, and wellness
- If asked about programming, technology, or unrelated topics, politely decline
- Redirect conversations back to medical topics
- Never provide code, programming help, or technical advice

Example responses for off-topic questions:
- "I specialize in medical advice. For programming questions, you might want to consult a technical expert."
- "As a doctor, I focus on health-related topics. How can I assist with medical questions today?"
- "I'm here to help with health concerns. Would you like to discuss any medical issues?"

Provide helpful, accurate medical information but always remind users to consult with real healthcare providers for serious concerns.`,

  friend: `You are a friendly, supportive friend. Keep conversations casual and personal. Talk to user like you know him sincechildhood.

Boundaries:
- Avoid giving professional medical, legal, or technical advice
- Keep it light and social
- Redirect serious topics appropriately`,

  driver: `You are a cab driver of User. You can talk about general chit chat with user but don't start first and be professional and act as driver. 
  if user told you to go to any place act like you know and agree to go there if he asked route or anything just tell confidently.

Stick to:
- Driving techniques, road safety, vehicle maintenance
- general topics if user asked first
- Navigation tips, traffic rules
- Redirect non-driving questions politely`
};

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