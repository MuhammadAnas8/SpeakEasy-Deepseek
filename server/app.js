import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import { logger } from "./utils/logger.js";
import dotenv from "dotenv";
import TOPIC_PROMPTS from "./Data/Topic.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://speakeasy-fyp.netlify.app",
  "http://localhost:5174",
  "https://j7spfpsd-5174.inc1.devtunnels.ms"
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(logger);

app.get("/", (_req, res) => res.send("Chat API Server is running!"));
app.use(routes);

// 404
app.use((_req, res) => res.status(404).json({ error: "Endpoint not found" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

console.log(`📚 Topics: ${Object.keys(TOPIC_PROMPTS).join(", ")}`);

export default app;
