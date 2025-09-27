export default function MicControls({ listening, onStart, onStop, onReset, onSend, disabled }) {
  return (
    <div className="controls">
      <button onClick={onStart} disabled={disabled}>🎤 Start</button>
      <button onClick={onStop} disabled={!listening}>⏹ Stop</button>
      <button onClick={onReset}>🔄 Reset</button>
      <button onClick={onSend} disabled={disabled}>🚀 Send</button>
      <span className="hint">{listening ? "🎧 Listening…" : "Click Start to speak"}</span>
    </div>
  );
}
