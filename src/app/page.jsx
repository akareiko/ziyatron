'use client';
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import LayoutWrapper from "./LayoutWrapper";
import AskInput from "./AskInput";
import SplineBackground from "./Splinebg";
import { useRef, useEffect } from "react";
import Link from "next/link";

// ---------------------
// Auth Popup (unchanged)
function AuthPopup({ onClose, animatedMode }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      alert("Registration successful! You can now login.");
      setIsRegister(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className={`p-6 rounded-2xl w-full max-w-sm flex flex-col gap-4 transition-colors duration-300 ${
          animatedMode
            ? "bg-[#e5e5d9] text-black"
            : "bg-white text-black border"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center">
          {isRegister ? "Register" : "Login"}
        </h2>
        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="flex flex-col gap-3"
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`py-2 rounded disabled:opacity-50 transition-colors duration-300 ${
              animatedMode
                ? "bg-black text-white"
                : "bg-black text-white hover:bg-gray-700"
            }`}
          >
            {loading
              ? isRegister
                ? "Registering..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>
        <button
          className={`text-sm self-center transition-colors duration-300 ${
            animatedMode ? "text-blue-600 hover:underline" : "text-blue-600 hover:underline"
          }`}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}

// ---------------------
// Ephemeral AskInput Wrapper with bottom-fixed behavior
function EphemeralAskInput({ onFirstMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // put these above your return inside EphemeralAskInput
function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960" width="12px" fill="#000000ff"><path d="M760-200H320q-33 0-56.5-23.5T240-280v-560q0-33 23.5-56.5T320-920h280l240 240v400q0 33-23.5 56.5T760-200ZM560-640v-200H320v560h440v-360H560ZM160-40q-33 0-56.5-23.5T80-120v-560h80v560h440v80H160Zm160-800v200-200 560-560Z"/></svg>
  );
}

function CopyButton({ text }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={doCopy}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Copy message"
        className="p-1 rounded-md hover:bg-black/10 transition"
      >
        <CopyIcon />
      </button>

      {/* Tooltip below button */}
      {(hover || copied) && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded text-xs text-white bg-black/80 whitespace-nowrap shadow">
          {copied ? "Copied!" : "Copy"}
        </div>
      )}
    </div>
  );
}

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
    if (messages.length === 0) onFirstMessage?.();

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/anon-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: "ephemeral", message }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (err) {
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
      {/* Ephemeral chat history */}
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

      {/* Input fixed at bottom after first message */}
      <div
        className={`w-full max-w-3xl mx-auto transition-[bottom] duration-500 ${
          messages.length > 0
            ? "fixed bottom-2 left-1/2 transform -translate-x-1/2"
            : "relative bottom-0"
        }`}
      >
        <AskInput
          onSend={(payload) => sendMessage(payload.message)}
          onUploadClick={() => {}}
          disabled={loading}
        />
      </div>
    </div>
  );
}

// ---------------------
// Main Page Component
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

  {/* Top-left Z toggle & top-right Sign In (always fixed) */}
  <div className="fixed top-4 left-4 z-50">
    <div
      onClick={() => setAnimatedMode(!animatedMode)}
      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
        animatedMode
          ? "bg-[#e5e5d9]/70 text-black"
          : "bg-black text-white border hover:bg-gray-200"
      }`}
    >
      Z
    </div>
  </div>

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

  {showAuth && <AuthPopup onClose={() => setShowAuth(false)} animatedMode={animatedMode} />}

  {/* Title */}
  <div
    className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 pb-30 ${
      firstMessageSent
        ? "top-4 text-4xl md:text-3xl" // slide to top
        : "top-1/2 -translate-y-1/2 text-4xl md:text-5xl" // center
    } font-bold text-center ${
      animatedMode ? "text-[#e5e5d9]" : "text-black"
    }`}
  >
    Ziyatron
  </div>

  {/* Chat input + annotation */}
  <div
    className={`absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 px-4 w-full max-w-3xl ${
      firstMessageSent ? "bottom-10" : "top-1/2" // below title initially
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
      {firstMessageSent ?
        //  "Ziyatron can make mistakes — please double-check important info." 
        ""
        : "Please refer to terms of service"}
    </p>
  </div>
</div>
  );
}