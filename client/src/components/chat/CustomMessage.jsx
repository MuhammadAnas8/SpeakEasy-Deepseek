import React from "react";
import { useMessageContext } from "stream-chat-react";

const CustomMessage = () => {
  const { message } = useMessageContext();
  return (
    <div className="px-3 py-1">
      <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
        {message.text}
      </div>
    </div>
  );
};

export default CustomMessage;
