import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export function useSpeechChat({ ttsLang = "en-US" } = {}) {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const start = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  const stop = () => SpeechRecognition.stopListening();

  const speak = (text) => {
    if (!text || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = ttsLang;
    window.speechSynthesis.speak(u);
  };

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    start,
    stop,
    speak,
  };
}
