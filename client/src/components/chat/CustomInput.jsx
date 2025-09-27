import React, { useState } from "react";
import { Mic, Send } from "lucide-react";

const CustomInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleMicClick = () => {
    if (!isRecording) {
      console.log("🎙️ Recording started...");
    } else {
      console.log("⏹️ Recording stopped...");
    }
    setIsRecording(!isRecording);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend?.(message); // call parent callback
    setMessage(""); // clear after sending
  };

  return (
    <div className="flex items-center w-full bg-white border rounded-2xl p-2 shadow-sm">
      {/* Mic button */}
      <button
        type="button"
        onClick={handleMicClick}
        className={`p-2 rounded-full transition ${
          isRecording ? "bg-red-500 text-white" : "hover:bg-gray-100"
        }`}
      >
        <Mic size={20} />
      </button>

      {/* Input box */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 mx-2 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
      />

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default CustomInput;
