import { useState, useEffect, useRef } from "react";
import AskInput from "./AskInput";
import CopyButton from "./CopyButton";
import { sendEphemeralMessage } from "../lib/api";

// ---------------------
// Ephemeral AskInput Wrapper

export default function EphemeralAskInput({ onFirstMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim() || loading) return;

    if (messages.length === 0) onFirstMessage?.();
    setLoading(true);
    setError("");

    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await sendEphemeralMessage(message);
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        throw new Error("Empty response from server");
      }
    } catch (err) {
      const errMsg = err?.message || "Failed to send message";
      setMessages((prev) => [...prev, { role: "system", content: `⚠️ ${errMsg}` }]);
      setError(errMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      {messages.length > 0 && (
        <div className="flex flex-col gap-4 mb-2 pb-24">
          {messages.map((msg, i) => {
            if (msg.role === "assistant") {
              return (
                <div key={i} className="flex flex-col items-start gap-1">
                  <div className="text-left px-5 py-3 rounded-2xl whitespace-pre-line leading-relaxed max-w-2xl break-words break-all overflow-x-hidden bg-white/70 text-black">
                    {msg.content}
                  </div>
                  <div className="pl-2">
                    <CopyButton text={msg.content} />
                  </div>
                </div>
              );
            } else if (msg.role === "user") {
              return (
                <div key={i} className="flex flex-col items-end gap-1">
                  <div className="inline-block px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg rounded-2xl text-black bg-[#243c5a]/15 break-words break-all overflow-x-hidden">
                    {msg.content}
                  </div>
                  <div className="pr-2">
                    <CopyButton text={msg.content} />
                  </div>
                </div>
              );
            } else {
              return (
                <div key={i} className="text-center text-sm text-red-400 italic">
                  {msg.content}
                </div>
              );
            }
          })}
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
      {error && <div className="text-center text-sm text-red-500 mt-2">{error}</div>}
    </div>
  );
}