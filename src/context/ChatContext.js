'use client';
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const ChatContext = createContext();

// Constants for configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://127.0.0.1:5001";
const DELTA_PROCESS_INTERVAL = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

export function ChatProvider({ children }) {
  const { authFetch, loading: authLoading, token } = useAuth();
  const [messagesByPatient, setMessagesByPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  // Refs for socket and processing
  const socketRef = useRef(null);
  const currentPatientIdRef = useRef(null);
  const deltaQueueRef = useRef([]);
  const processingIntervalRef = useRef(null);
  const retryCountRef = useRef(0);
  const isCleaningUpRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    isCleaningUpRef.current = true;
    
    // Clear processing interval
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    
    // Clear delta queue
    deltaQueueRef.current = [];
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    setIsStreaming(false);
    setConnectionStatus('disconnected');
  }, []);

  // Socket connection with retry logic
  const connectSocket = useCallback(async () => {
    if (authLoading || !token || socketRef.current?.connected) return;
    
    try {
      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: MAX_RETRY_ATTEMPTS,
        reconnectionDelay: RETRY_DELAY,
      });

      // Connection events
      socket.on("connect", () => {
        console.log("Socket connected");
        setConnectionStatus('connected');
        retryCountRef.current = 0;
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setConnectionStatus('disconnected');
        setIsStreaming(false);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connect error:", err);
        setConnectionStatus('error');
        retryCountRef.current++;
        
        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          setError("Failed to connect to chat service. Please refresh the page.");
        }
      });

      // Assistant streaming events
      socket.on("assistant_update", (chunk) => {
  const patientId = currentPatientIdRef.current;
  const delta = chunk.text_delta || "";
  if (!patientId || !delta) return;

  setIsStreaming(true);
  setMessagesByPatient(prev => {
    const updated = [...(prev[patientId] || [])];
    let msg;
    
    if (!updated.length || updated[updated.length - 1].role !== "assistant") {
      msg = { role: "assistant", content: { text: "" }, timestamp: new Date().toISOString(), id: `msg_${Date.now()}_${Math.random()}` };
      updated.push(msg);
    } else {
      msg = updated[updated.length - 1];
    }

    msg.content.text = appendDeltaSafe(msg.content.text, delta);
    return { ...prev, [patientId]: updated };
  });
});

      socket.on("stream_complete", () => {
        setIsStreaming(false);
        currentPatientIdRef.current = null;
      });

      socket.on("stream_error", (error) => {
        console.error("Stream error:", error);
        setIsStreaming(false);
        setError("Streaming error occurred. Please try again.");
      });

      socketRef.current = socket;
      
    } catch (err) {
      console.error("Failed to create socket connection:", err);
      setConnectionStatus('error');
    }
  }, [authLoading, token]);

  // Delta processing with proper cleanup
  useEffect(() => {
    if (isCleaningUpRef.current) return;
    
    processingIntervalRef.current = setInterval(() => {
      if (deltaQueueRef.current.length === 0) {
        if (isStreaming && currentPatientIdRef.current === null) {
          setIsStreaming(false);
        }
        return;
      }

      setIsStreaming(true);
      const { patientId, text } = deltaQueueRef.current.shift();

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

        msg.content.text = appendDeltaSafe(msg.content.text, text);
        return { ...prev, [patientId]: updated };
      });
    }, DELTA_PROCESS_INTERVAL);

    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
        processingIntervalRef.current = null;
      }
    };
  }, [isStreaming]);

  // Initialize socket connection
  useEffect(() => {
    connectSocket();
    
    return cleanup;
  }, [connectSocket, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

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
      const data = await authFetch(`${SOCKET_URL}/chat-history/${patientId}`);
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
  }, [authFetch, messagesByPatient, loading]);

  // Send message with improved error handling
  const sendMessage = useCallback(async (patientId, { message, file_url, file_name }) => {
    if (!patientId || (!message?.trim() && !file_url) || !socketRef.current?.connected) {
      if (!socketRef.current?.connected) {
        setError("Connection lost. Please refresh the page.");
      }
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
      const data = await authFetch(`${SOCKET_URL}/chat/${patientId}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, file_url, file_name }),
      });

      const { session_id, eeg_summary } = data;

      // Join session and start streaming
      socketRef.current.emit("join", { session_id });
      socketRef.current.emit("start_assistant", {
        patient_id: patientId,
        session_id,
        message,
        eeg_summary,
        token,
      });

      setIsStreaming(true);

    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to send message. Please try again.");
      
      // Remove optimistic message on error
      setMessagesByPatient(prev => ({
        ...prev,
        [patientId]: (prev[patientId] || []).filter(msg => msg.id !== userMessage.id),
      }));
    }
  }, [authFetch, token]);

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
    setTimeout(connectSocket, 1000);
  }, [cleanup, connectSocket]);

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