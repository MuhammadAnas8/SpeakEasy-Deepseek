export default function MessageBubble({ from, text }) {
  const isUser = from === "user";
  return (
    <div
      className={`bubble ${isUser ? "user" : "bot"}`}
      aria-label={isUser ? "Your message" : "Assistant message"}
      role="article"
    >
      <div className="bubble-meta">{isUser ? "You" : "Assistant"}</div>
      <div className="bubble-text">{text}</div>
    </div>
  );
}