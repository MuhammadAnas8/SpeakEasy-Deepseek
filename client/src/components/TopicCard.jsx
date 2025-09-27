import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/home.css";

const TopicCard = ({ title, text, bgImage }) => {
  const navigate = useNavigate();

  const topicHandler = () => {
    // open /chat with ?topic=<title>
    navigate(`/chat?topic=${encodeURIComponent(title)}`);
  };
  return (
    <article className="card">
      <div
        className="card-media"
        style={{ background: `url(${bgImage}) center/cover  no-repeat` }}
      />
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="card-text">{text}</p>
        <button onClick={topicHandler} className="btn btn--primary">Select</button>
      </div>
    </article>
  );
};

export default TopicCard;
