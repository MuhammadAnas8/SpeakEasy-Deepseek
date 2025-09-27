import React, { useState } from "react";
import { TextareaComposer, useMessageInputContext } from "stream-chat-react";
import { Mic, Send } from "lucide-react";

const CustomInput = () => {
  const { handleSubmit } = useMessageInputContext();
  const [isRecording, setIsRecording] = useState(false);

  const handleMicClick = () => {
    if (!isRecording) {
      console.log("🎙️ Recording started...");
    } else {
      console.log("⏹️ Recording stopped...");
    }
    setIsRecording(!isRecording);
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
      <div className="flex-1 mx-2">
        <TextareaComposer
          placeholder="Type a message..."
          className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Send button (custom, no warning) */}
      <button
        type="button"
        onClick={handleSubmit}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default CustomInput;
