'use client';
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { authFetch, loading: authLoading } = useAuth();
  const [messagesByPatient, setMessagesByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadHistory(patientId) {
    if (!patientId || messagesByPatient[patientId]) return;

    setLoading(true);
    setError(null);

    try {
      const data = await authFetch(`http://127.0.0.1:5000/chat-history/${patientId}`);
      setMessagesByPatient((prev) => ({
        ...prev,
        [patientId]: data || [],
      }));
    } catch (err) {
      console.error("Failed to fetch chat history", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(patientId, { message, file_url, file_name }) {
    // Do nothing if both are missing
    if (!message && !file_url) return;

    // Optimistic UI for user
    const userMessage = { role: "user", content: message || "📄 Sent file" };
    setMessagesByPatient((prev) => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), userMessage],
    }));

    try {
      // POST to backend
      const data = await authFetch(`http://127.0.0.1:5000/chat/${patientId}`, {
        method: "POST",
        body: JSON.stringify({ message, file_url, file_name }),
      });

      // If backend returns assistant response, add to chat
      if (data.response) {
      const assistantData = data.response; // this is already JSON from backend

      // Create a friendly object to store in state
      const assistantMessage = {
        role: "assistant",
        content: assistantData.text || "",        // Markdown text
        highlights: assistantData.highlights || [],
        next_steps: assistantData.next_steps || [],
        warnings: assistantData.warnings || [],
      };

      setMessagesByPatient((prev) => ({
        ...prev,
        [patientId]: [...(prev[patientId] || []), assistantMessage],
      }));
    }

      // If backend returns EEG summary (file only), add system message
      if (data.eeg_summary) {
        const systemMessage = { role: "system", content: data.eeg_summary };
        setMessagesByPatient((prev) => ({
          ...prev,
          [patientId]: [...(prev[patientId] || []), systemMessage],
        }));
      }
    } catch (err) {
      console.error("Failed to send message", err);
      setMessagesByPatient((prev) => ({
        ...prev,
        [patientId]: [
          ...(prev[patientId] || []),
          { role: "system", content: "⚠️ Failed to send message." },
        ],
      }));
    }
  }

  if (authLoading) return null;

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