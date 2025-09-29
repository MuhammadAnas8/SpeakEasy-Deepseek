import { Router } from "express";
import { chatHandler, getHistoryHandler, clearHistoryHandler } from "../controller/chatController.js";

const router = Router();

router.post("/chat", chatHandler);
router.get("/chat/history", getHistoryHandler);
router.delete("/chat/history", clearHistoryHandler);

export default router;
