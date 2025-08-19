import React, { createContext, useState, useContext, useEffect } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://127.0.0.1:5000/chat-history");
        const data = await res.json();
        setMessages(data);  // Load saved messages
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    }
    fetchHistory();
  }, []);

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}