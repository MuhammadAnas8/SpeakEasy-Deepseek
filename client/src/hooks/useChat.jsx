import { useEffect, useState } from "react";
import axios from "axios";
import { Speaker } from "lucide-react";

export default function useChat(selectedTopic) {
  const [messages, setMessages] = useState([]);
const speak = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  }
  useEffect(() => {
    setMessages([]); // reset when topic changes
  }, [selectedTopic]);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const { data } = await axios.post("http://localhost:8000/chat", {
        message: text,
        topic: selectedTopic.id,
        
      });
      speak(data.reply);
      console.log("✅ Chat response:", data);
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Chat error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return { messages, sendMessage };
}
