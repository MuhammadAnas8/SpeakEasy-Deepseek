

export function getSenderId() {
  const KEY = "rasa_sender_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    localStorage.setItem(KEY, id);
  }
  return id;
}
