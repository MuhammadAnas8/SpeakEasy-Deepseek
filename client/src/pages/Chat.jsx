import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import CustomInput from "../components/chat/CustomInput";
import TopicSidebar from "../components/chat/TopicSidebar";
import CustomMessage from "../components/chat/CustomMessage";


const topics = [
  { id: "dr", name: "Talk to Dr" },
  { id: "friend", name: "Friend" },
  { id: "driver", name: "Driver" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  // refs for scrolling
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // reset chat when topic changes
  useEffect(() => {
    setMessages([]);
  }, [selectedTopic]);

  // useLayoutEffect runs before paint — avoids flashing and race conditions
  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // if user has scrolled up (reading older messages), don't force-scroll them down
    const NEAR_BOTTOM_THRESHOLD = 150; // px
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      NEAR_BOTTOM_THRESHOLD;

    if (isNearBottom) {
      // use requestAnimationFrame to ensure layout is stable, then jump
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        // fallback: also scroll the end ref into view (safe)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages]); // run whenever messages change

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const { data } = await axios.post("http://localhost:8000/chat", {
        message: text,
        topic: selectedTopic.id,
      });

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

  return (
    <div className="flex h-screen">
      <TopicSidebar
        topics={topics}
        selectedTopic={selectedTopic}
        onSelect={setSelectedTopic}
      />

      <div className="flex flex-col flex-1 bg-gray-50">
        {/* Messages container: IMPORTANT - this element must have overflow-y and a constrained height */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ WebkitOverflowScrolling: "touch" }} // smoother on mobile
        >
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <CustomMessage key={i} sender={msg.sender} text={msg.text} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white">
          <CustomInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
