import express from "express";
import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
import cors from "cors";

// Enable CORS for all origins (for development purposes)



dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

// --- Stream setup ---
const apiKey = process.env.STREAM_API_KEY;       // from Stream dashboard
const apiSecret = process.env.STREAM_API_SECRET; // from Stream dashboard
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

const PORT = process.env.PORT || 8000;
const HOST = "0.0.0.0";

// Logger (optional)
app.use((req, _res, next) => {
  console.log(">>", req.method, req.originalUrl);
  next();
});

// Health check
app.get("/", (_req, res) => res.send("OK"));

app.get("/token", (req, res) => {
  const { userId } = req.query;
  const token = serverClient.createToken(userId);
  res.json({ token });
});

// send assistant reply into Stream
app.post("/api/send-assistant", async (req, res) => {
  const { channelId = "general", text } = req.body;
  const channel = serverClient.channel("messaging", channelId);
  await channel.sendMessage({ text, user_id: "assistant" });
  res.json({ ok: true });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 API listening on http://${HOST}:${PORT}`);
});
