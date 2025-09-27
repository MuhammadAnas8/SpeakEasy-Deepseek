import React, { useState, useEffect } from "react";
import { Mic, Send } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const CustomInput = ({ onSend }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (listening) {
      setMessage(transcript); // update text area live with speech
    }
  }, [transcript, listening]);

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    if (isRecording) {
      SpeechRecognition.stopListening();
      console.log("⏹️ Recording stopped...");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      console.log("🎙️ Recording started...");
    }
    setIsRecording(!isRecording);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend?.(message); // send to parent
    setMessage(""); // clear input
    resetTranscript();
    if (isRecording) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    }
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
        placeholder="Type or speak a message..."
        rows={1}
        className="flex-1 mx-2 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        onKeyDown={(e) =>
          e.key === "Enter" &&
          !e.shiftKey &&
          (e.preventDefault(), handleSend())
        }
      />

      {/* Send button */}
      <button
        type="button"
        disabled={!message.trim()}

        onClick={handleSend}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover transition"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default CustomInput;
