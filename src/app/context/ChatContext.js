import React, { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messagesByPatient, setMessagesByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadHistory(patientId) {
    if (!patientId) return;

    if (messagesByPatient[patientId]) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:5000/chat-history/${patientId}`);
      if (!res.ok) throw new Error("Failed to fetch chat history");

      const data = await res.json();

      setMessagesByPatient((prev) => ({
        ...prev,
        [patientId]: data || [],
      }));
    } catch (err) {
      console.error("Failed to fetch chat history", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(patientId, messageText) {
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };

    setMessagesByPatient((prev) => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), userMessage],
    }));

    try {
      const res = await fetch(`http://127.0.0.1:5000/chat/${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      if (data.response) {
        const assistantMessage = { role: "assistant", content: data.response };
        setMessagesByPatient((prev) => ({
          ...prev,
          [patientId]: [...(prev[patientId] || []), assistantMessage],
        }));
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessagesByPatient((prev) => ({
        ...prev,
        [patientId]: [
          ...(prev[patientId] || []),
          { role: "system", content: "⚠️ Failed to send message." },
        ],
      }));
    }
  }

  return (
    <ChatContext.Provider
      value={{ messagesByPatient, loadHistory, sendMessage, loading, error }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}