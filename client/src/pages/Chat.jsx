import React, { useState } from "react";
import CustomInput from "../components/chat/CustomInput";
import TopicSidebar from "../components/chat/TopicSideBar";
import CustomMessage from "../components/chat/CustomMessage";
import useChat from "../hooks/useChat";
import useAutoScroll from "../hooks/useAutoScroll";
import { useSearchParams } from "react-router-dom";

const topics = [
  { id: "dr", name: "Talk to Dr" },
  { id: "friend", name: "Friend" },
  { id: "driver", name: "Driver" },
];



export default function ChatPage() {
  const topicParam = useSearchParams()[0].get("topic");
  const topic = topics.find((t) => t.id === topicParam) || topics[0];
  const [selectedTopic, setSelectedTopic] = useState(topic || topics[0]);
  const { messages, sendMessage } = useChat(selectedTopic);
  const { containerRef, endRef } = useAutoScroll([messages]);
   const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
<div className="md:flex h-screen">
  {/* Sidebar for desktop only */}
  <TopicSidebar
    topics={topics}
    selectedTopic={selectedTopic}
    onSelect={(t) => {
      setSelectedTopic(t);
      setSidebarOpen(false);
    }}
    className="hidden md:block w-64 border-r bg-white"
  />

  {/* Chat section */}
  <div className="flex flex-col flex-1 h-screen bg-gray-50">
    {/* Header */}
    <div className="flex items-center justify-between p-3 border-b bg-white">
      <h1 className="font-medium">{selectedTopic.name}</h1>
    </div>

    {/* Messages (takes all remaining space) */}
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

    <div className="p-3 border-t bg-white">
      <CustomInput onSend={sendMessage} />
    </div>
  </div>
</div>

  );
}
