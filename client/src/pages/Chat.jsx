import React, { useState } from "react";
import CustomInput from "../components/chat/CustomInput";
import TopicSidebar from "../components/chat/TopicSidebar";
import CustomMessage from "../components/chat/CustomMessage";
import useChat from "../hooks/useChat";
import useAutoScroll from "../hooks/useAutoScroll";

const topics = [
  { id: "dr", name: "Talk to Dr" },
  { id: "friend", name: "Friend" },
  { id: "driver", name: "Driver" },
];

export default function ChatPage() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const { messages, sendMessage } = useChat(selectedTopic);
  const { containerRef, endRef } = useAutoScroll([messages]);

  return (
    <div className="flex h-screen">
      <TopicSidebar
        topics={topics}
        selectedTopic={selectedTopic}
        onSelect={setSelectedTopic}
      />

      <div className="flex flex-col flex-1 bg-gray-50">
        {/* Messages */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex flex-col gap-3">
            {messages?.map((msg, i) => (
              <CustomMessage key={i} sender={msg.sender} text={msg.text} />
            ))}
            <div ref={endRef} />
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
