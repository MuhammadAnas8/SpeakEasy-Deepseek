const store = new Map();

export const getHistory = (topic) => {
  const key = `topic_${topic}`;
  if (!store.has(key)) store.set(key, []);
  return store.get(key);
};

export const setHistory = (topic, history) => {
  store.set(`topic_${topic}`, history);
};

export const clearHistory = (topic) => {
  if (topic) store.delete(`topic_${topic}`);
  else store.clear();
};

export const getAllHistories = () => store;
