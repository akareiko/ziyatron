'use client';
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

// Constants for configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
console.log(SOCKET_URL);
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export function ChatProvider({ children }) {
  const { authFetch, loading: authLoading, token } = useAuth();
  const [messagesByPatient, setMessagesByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Refs for WebSocket and processing
  const wsRef = useRef(null);
  const currentPatientIdRef = useRef(null);
  const currentSessionIdRef = useRef(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsStreaming(false);
    setConnectionStatus('disconnected');
  }, []);

  // WebSocket connection with retry logic
  const connectWebSocket = useCallback((sessionId) => {
    if (authLoading || !token || !sessionId) return;

    try {
      const wsUrl = `${SOCKET_URL}/ws/${sessionId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus('connected');
        retryCountRef.current = 0;

        // Send join message
        ws.send(JSON.stringify({ type: "join" }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.status) {
            console.log("WebSocket status:", data.status);
            return;
          }

          if (data.assistant_update) {
            handleAssistantUpdate(data.assistant_update);
          }

          if (data.stream_complete) {
            setIsStreaming(false);
            currentPatientIdRef.current = null;
            currentSessionIdRef.current = null;
          }

        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setConnectionStatus('disconnected');
        setIsStreaming(false);

        // Auto-reconnect logic
        if (!event.wasClean && retryCountRef.current < MAX_RETRY_ATTEMPTS) {
          retryCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (currentSessionIdRef.current) {
              connectWebSocket(currentSessionIdRef.current);
            }
          }, RETRY_DELAY * retryCountRef.current);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus('error');

        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          setError("Failed to connect to chat service. Please refresh the page.");
        }
      };

      wsRef.current = ws;

    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
      setConnectionStatus('error');
    }
  }, [authLoading, token]);

  // Handle assistant update messages
  const handleAssistantUpdate = useCallback((update) => {
    const patientId = currentPatientIdRef.current;
    const delta = update.text_delta || "";

    if (!patientId || !delta) return;

    setIsStreaming(true);
    setMessagesByPatient(prev => {
      const updated = [...(prev[patientId] || [])];
      let msg;

      if (!updated.length || updated[updated.length - 1].role !== "assistant") {
        msg = {
          role: "assistant",
          content: { text: "" },
          timestamp: new Date().toISOString(),
          id: `msg_${Date.now()}_${Math.random()}`
        };
        updated.push(msg);
      } else {
        msg = updated[updated.length - 1];
      }

      msg.content.text = appendDeltaSafe(msg.content.text, delta);
      return { ...prev, [patientId]: updated };
    });
  }, []);

  // Text processing functions (improved)
  function sanitizeDeltaForMarkdown(currentText, delta) {
    if (!delta) return delta;

    // Remove problematic characters
    delta = delta.replace(/[\u200B\uFEFF]/g, '').replace(/\u00A0/g, ' ');

    // Handle markdown structure
    if (/^\s*(#{1,6}\s+|- |\* |\d+\.\s+|> )/.test(delta) &&
      currentText && !currentText.endsWith('\n')) {
      delta = '\n' + delta.trimStart();
    }

    delta = delta.replace(/(?<!\n)\s+(?=(#{1,6}\s+|- |\* |\d+\.\s+|> ))/g, '\n');
    return delta;
  }

  function appendDeltaSafe(currentText, delta) {
    if (!delta) return currentText;

    const sanitized = sanitizeDeltaForMarkdown(currentText, delta);
    let overlap = 0;
    const maxOverlap = Math.min(currentText.length, sanitized.length);

    for (let i = maxOverlap; i > 0; i--) {
      if (currentText.endsWith(sanitized.slice(0, i))) {
        overlap = i;
        break;
      }
    }

    return currentText + sanitized.slice(overlap);
  }

  // Load chat history with error handling
  const loadHistory = useCallback(async (patientId) => {
    if (!patientId || messagesByPatient[patientId] || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/chat-history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to load chat history');
      }

      const data = await response.json();
      const messagesWithIds = (data || []).map(msg => ({
        ...msg,
        id: msg.id || `msg_${Date.now()}_${Math.random()}`,
        timestamp: msg.timestamp || new Date().toISOString()
      }));

      setMessagesByPatient(prev => ({
        ...prev,
        [patientId]: messagesWithIds
      }));
    } catch (err) {
      console.error("Failed to fetch chat history", err);
      setError("Failed to load chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, messagesByPatient, loading]);

  // Send message with improved error handling
  const sendMessage = useCallback(async (patientId, { message, file_url, file_name }) => {
    if (!patientId || (!message?.trim() && !file_url)) {
      return;
    }

    currentPatientIdRef.current = patientId;
    setError(null);

    // Optimistic UI update
    const userMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: "user",
      content: message || "",
      file: file_url ? { url: file_url, name: file_name } : null,
      timestamp: new Date().toISOString(),
    };

    setMessagesByPatient(prev => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), userMessage],
    }));

    try {
      // Step 1: Send message to FastAPI backend
      const response = await fetch(`${API_URL}/chat/${patientId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, file_url, file_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const data = await response.json();

      const { session_id, eeg_summary } = data;
      currentSessionIdRef.current = session_id;

      // Step 2: Connect WebSocket for this session
      connectWebSocket(session_id);

      // Step 3: Wait a moment for connection, then start assistant
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: "start_assistant",
            token: `Bearer ${token}`,
            patient_id: patientId,
            session_id,
            message,
            eeg_summary
          }));
          setIsStreaming(true);
        } else {
          setError("Failed to establish WebSocket connection");
        }
      }, 100);

    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to send message. Please try again.");

      // Remove optimistic message on error
      setMessagesByPatient(prev => ({
        ...prev,
        [patientId]: (prev[patientId] || []).filter(msg => msg.id !== userMessage.id),
      }));
    }
  }, [authFetch, token, connectWebSocket]);

  // Clear messages for a patient (memory management)
  const clearPatientMessages = useCallback((patientId) => {
    setMessagesByPatient(prev => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });
  }, []);

  // Retry connection
  const retryConnection = useCallback(() => {
    cleanup();
    retryCountRef.current = 0;
    if (currentSessionIdRef.current) {
      setTimeout(() => connectWebSocket(currentSessionIdRef.current), 1000);
    }
  }, [cleanup, connectWebSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (authLoading) return null;

  const contextValue = {
    messagesByPatient,
    loadHistory,
    sendMessage,
    loading,
    error,
    isStreaming,
    setIsStreaming,
    connectionStatus,
    retryConnection,
    clearPatientMessages,
    setError: (error) => setError(error),
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}