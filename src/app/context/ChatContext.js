'use client';
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { authFetch, loading: authLoading } = useAuth();
  const [messagesByPatient, setMessagesByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef(null);
  const currentPatientIdRef = useRef(null);

  // Helper to append delta while avoiding repeated text
  function appendDeltaSafe(currentText, delta) {
    if (!delta) return currentText;

    // Find the longest overlap between end of currentText and start of delta
    let overlap = 0;
    const maxOverlap = Math.min(currentText.length, delta.length);

    for (let i = maxOverlap; i > 0; i--) {
      if (currentText.endsWith(delta.slice(0, i))) {
        overlap = i;
        break;
      }
    }

    return currentText + delta.slice(overlap);
  }

  // Initialize socket
  useEffect(() => {
    if (!authLoading && !socketRef.current) {
      socketRef.current = io("http://127.0.0.1:5001", {
        auth: { token: localStorage.getItem("token") },
        transports: ["websocket"],
      });
      socketRef.current.on("connect_error", (err) => console.error("Socket connect error", err));
    }
  }, [authLoading]);

  // Listen for assistant updates
  // This useRef holds all incoming deltas in a queue
  const deltaQueueRef = useRef([]);

  useEffect(() => {
    if (!authLoading && socketRef.current) {
      socketRef.current.off("assistant_update");
      socketRef.current.on("assistant_update", (chunk) => {
        const patientId = currentPatientIdRef.current;
        if (!patientId) return;

        const delta = chunk.text_delta || "";
        if (!delta) return;

        // <-- Push the delta into the queue here
        deltaQueueRef.current.push({ patientId, text: delta });
      });
    }
  }, [authLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (deltaQueueRef.current.length === 0) {
        // Queue empty → streaming finished
        setIsStreaming(false);
        return;
      }
      setIsStreaming(true);

      const { patientId, text } = deltaQueueRef.current.shift();

      setMessagesByPatient(prev => {
        const updated = [...(prev[patientId] || [])];
        let msg;
        if (!updated.length || updated[updated.length - 1].role !== "assistant") {
          msg = { role: "assistant", content: { text: "" } };
          updated.push(msg);
        } else {
          msg = updated[updated.length - 1];
        }

        msg.content.text = appendDeltaSafe(msg.content.text, text);
        return { ...prev, [patientId]: updated };
      });
    }, 50); // 50ms per chunk, adjust as needed

    return () => clearInterval(interval);
  }, []);

  // Load chat history
  async function loadHistory(patientId) {
    if (!patientId || messagesByPatient[patientId]) return;
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch(`http://127.0.0.1:5001/chat-history/${patientId}`);
      setMessagesByPatient(prev => ({ ...prev, [patientId]: data || [] }));
    } catch (err) {
      console.error("Failed to fetch chat history", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Send message
  async function sendMessage(patientId, { message, file_url, file_name }) {
    currentPatientIdRef.current = patientId;
    if (!message && !file_url) return;

    // Optimistic UI
    const userMessage = { role: "user", content: message || "📄 Sent file" };
    setMessagesByPatient(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), userMessage],
    }));

    try {
      const data = await authFetch(`http://127.0.0.1:5001/chat/${patientId}`, {
        method: "POST",
        body: JSON.stringify({ message, file_url, file_name }),
      });

      const session_id = data.session_id;
      const eeg_summary = data.eeg_summary;

      socketRef.current.emit("join", { session_id });
      socketRef.current.emit("start_assistant", {
        patient_id: patientId,
        session_id,
        message,
        eeg_summary,
        token: localStorage.getItem("token"),
      });

    } catch (err) {
      console.error("Failed to send message", err);
      setMessagesByPatient(prev => ({
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
    <ChatContext.Provider value={{ messagesByPatient, loadHistory, sendMessage, loading, error, isStreaming, setIsStreaming }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}