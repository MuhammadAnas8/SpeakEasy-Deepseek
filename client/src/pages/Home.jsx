import React from "react";
import "../styles/home.css";
import topicsData from "../data/topicsData";
import TopicCard from "../components/TopicCard";

export default function Home() {
  return (
    <main className="home">
      {/* Top status/toolbar space is handled by padding in CSS */}
      <header className="home-header">
        <button className="icon-btn" aria-label="Go back">
          {/* back chevron */}
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="titles">
          <h1>Conversational AI</h1>
          <p className="subtitle">
            Practice your voice by chatting with AI. Train your voice where it matters the most
          </p>
        </div>
      </header>

      <section className="cards">
        {topicsData.map((item, i) => (
        <TopicCard
          key={i}
          title={item.title}
          text={item.text}
          bgImage={item.bgImage}
        />
      ))}
        
      </section>
    </main>
  );
}
