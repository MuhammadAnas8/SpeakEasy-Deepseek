import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { useSearchParams } from "react-router-dom";
import "stream-chat-react/dist/css/v2/index.css";

import CustomInput from "../components/chat/CustomInput";
import CustomMessage from "../components/chat/CustomMessage";
import TopicSidebar from "../components/chat/TopicSidebar";

const apiKey = "csxy28pygm9g";
const userId = "Ali"; 

async function fetchToken(userId) {
  const { data } = await axios.get(`http://localhost:8000/token?userId=${userId}`);
  return data.token;
}

const topics = [
  { id: "dr", name: "Talk to Dr" },
  { id: "friend", name: "Friend" },
  { id: "driver", name: "Driver" },
];

export default function ChatPage() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [searchParams] = useSearchParams();

  const topicFromUrl = searchParams.get("topic");
  const [selectedTopic, setSelectedTopic] = useState(
    topicFromUrl ? topics.find(t => t.id === topicFromUrl) : topics[2]
  );

  useEffect(() => {
    let chatClient;
    async function init() {
      const token = await fetchToken(userId);
      chatClient = StreamChat.getInstance(apiKey);

      await chatClient.connectUser({ id: userId, name: "Anas" }, token);
      setClient(chatClient);

      const ch = chatClient.channel("messaging", selectedTopic.id, {
        name: selectedTopic.name,
      });
      await ch.watch();
      setChannel(ch);
    }
    init();

    return () => {
      // if (chatClient) chatClient.disconnectUser();
    };
  }, [selectedTopic]);

  if (!client || !channel) return <div>Loading...</div>;

  return (
    <Chat client={client}>
      <div style={{ display: "flex" }}>
        <TopicSidebar
          topics={topics}
          selectedTopic={selectedTopic}
          onSelect={setSelectedTopic}
        />
        <main style={{ flex: 1 }}>
          <Channel channel={channel} Input={CustomInput} Message={CustomMessage}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </main>
      </div>
    </Chat>
  );
}
