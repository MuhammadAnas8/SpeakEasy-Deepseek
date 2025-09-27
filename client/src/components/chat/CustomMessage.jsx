import React from "react";

const CustomMessage = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div
      className={`flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-3 py-2 rounded-lg max-w-xs ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default CustomMessage;
