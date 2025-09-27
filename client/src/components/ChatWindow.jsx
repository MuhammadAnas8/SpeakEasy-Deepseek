import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages }) {
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window" ref={listRef}>
      {messages.map((m) => (
        <MessageBubble key={m.id ?? `${m.from}-${m.at}`} from={m.from} text={m.text} />
      ))}
    </div>
  );
}
