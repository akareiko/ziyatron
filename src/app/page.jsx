"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LayoutWrapper from "../components/LayoutWrapper";
import AskInput from "../components/AskInput";
import dynamic from "next/dynamic";
import Link from "next/link";
import CopyButton from "../components/CopyButton";
import DragDropOverlay from "../components/DragDropOverlay";


const SplineBackground = dynamic(() => import("../components/Splinebg"), { ssr: false });

/* ------------------------
   Ephemeral AskInput
------------------------ */
function EphemeralAskInput({ onFirstMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("ephemeralChat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      sessionStorage.setItem("ephemeralChat", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    if (messages.length === 0) onFirstMessage?.();

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/anon-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: "ephemeral", message }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "⚠️ Failed to send message." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      {messages.length > 0 && (
        <div className="flex flex-col gap-4 mb-2 pb-24">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col gap-1 items-start">
              <div
                className={`px-5 py-3 rounded-2xl whitespace-pre-line leading-relaxed max-w-2xl break-words overflow-x-hidden ${
                  msg.role === "assistant"
                    ? "bg-white/70 text-black self-start"
                    : msg.role === "user"
                    ? "bg-[#243c5a]/15 text-black self-end"
                    : "text-red-400 italic text-sm text-center w-full"
                }`}
              >
                {msg.content}
              </div>
              {(msg.role === "assistant" || msg.role === "user") && (
                <CopyButton text={msg.content} />
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      )}

      <div
        className={`w-full max-w-3xl mx-auto transition-[bottom] duration-500 ${
          messages.length > 0
            ? "fixed bottom-2 left-1/2 transform -translate-x-1/2"
            : "relative bottom-0"
        }`}
      >
        <AskInput
          onSend={(payload) => sendMessage(payload.message)}
          disabled={loading}
        />
      </div>
    </div>
  );
}

/* ------------------------
   Main Page
------------------------ */
export default function Page({ children }) {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [animatedMode, setAnimatedMode] = useState(true);
  const [firstMessageSent, setFirstMessageSent] = useState(false);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  if (user) return <LayoutWrapper>{children}</LayoutWrapper>;

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        animatedMode ? "text-gray-200 bg-[#121212]" : "text-black bg-gray-100"
      }`}
    >
      {animatedMode && <SplineBackground />}

      {/* Top-left toggle */}
      <button
        onClick={() => setAnimatedMode(!animatedMode)}
        className={`fixed top-4 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
          animatedMode
            ? "bg-[#e5e5d9]/70 text-black"
            : "bg-black text-white border hover:bg-gray-200"
        }`}
        aria-label="Toggle theme"
      >
        Z
      </button>

      {/* Sign In */}
      <div className="fixed top-4 right-4 z-50">
        <Link href="/login">
          <button
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              animatedMode ? "bg-[#e5e5d9]/70 text-black" : "bg-black text-white"
            }`}
          >
            Sign In
          </button>
        </Link>
      </div>

      {showAuth && (
        <AuthPopup onClose={() => setShowAuth(false)} animatedMode={animatedMode} />
      )}

      {/* Title */}
      <h1
        className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 pb-30 ${
          firstMessageSent
            ? "top-4 text-4xl md:text-3xl"
            : "top-1/2 -translate-y-1/2 text-4xl md:text-5xl"
        } font-bold text-center ${animatedMode ? "text-[#e5e5d9]" : "text-black"}`}
      >
        Ziyatron
      </h1>

      {/* Chat input + annotation */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 px-4 w-full max-w-3xl ${
          firstMessageSent ? "bottom-10" : "top-1/2"
        }`}
      >
        <EphemeralAskInput
          onFirstMessage={() => {
            setFirstMessageSent(true);
            setAnimatedMode(false);
          }}
        />
        <p
          className={`text-xs md:text-base text-center transition-all duration-500 ${
            animatedMode ? "text-[#e5e5d9]/70" : "text-gray-600"
          }`}
        >
          {firstMessageSent ? "" : "Please refer to terms of service"}
        </p>
      </div>

      <DragDropOverlay onFileDrop={(file) => console.log("Dropped file:", file)} />
    </div>
  );
}