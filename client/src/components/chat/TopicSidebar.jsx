import React from "react";

const TopicSidebar = ({ topics, selectedTopic, onSelect }) => {
  return (
    <aside style={{ width: 200, borderRight: "1px solid #ddd" }}>
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic)}
          style={{
            width: "100%",
            padding: 12,
            textAlign: "left",
            background: topic.id === selectedTopic.id ? "#eee" : "#fff",
            border: "none",
            borderBottom: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {topic.name}
        </button>
      ))}
    </aside>
  );
};

export default TopicSidebar;
