'use client';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LayoutWrapper from "./LayoutWrapper";
import { useChat } from "../context/ChatContext";
import AskInput from "./AskInput";
import { useParams } from "next/navigation";
import SplineBackground from "./Splinebg"; // Client-only Spline component

// ---------------------
// Auth Popup
// ---------------------
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
// AskInputWrapper
// ---------------------
function AskInputWrapper() {
  const { sendMessage } = useChat();
  const { patientId } = useParams();

  return (
    <AskInput
      onSend={(payload) => sendMessage(patientId, payload)}
      onUploadClick={() => {}}
    />
  );
}

// ---------------------
// Main Page Component
// ---------------------
export default function Page({ children }) {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Start in Spline mode
  const [animatedMode, setAnimatedMode] = useState(true);

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
      {/* Conditional Spline background */}
      {animatedMode && <SplineBackground />}

      {/* Top-left logo (acts as toggle) */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2 cursor-pointer">
        <div
          onClick={() => setAnimatedMode(!animatedMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
            animatedMode
              ? "bg-[#e5e5d9]/70 text-black"
              : "bg-black text-white border hover:bg-gray-200"
          }`}
        >
          Z
        </div>
      </div>

      {/* Top-right Sign In button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowAuth(true)}
          className={`px-4 py-2 rounded-full transition-colors duration-300 ${
            animatedMode
              ? "bg-[#e5e5d9]/70 text-black"
              : "bg-black text-white"
          }`}
        >
          Sign In
        </button>
      </div>

      {showAuth && <AuthPopup onClose={() => setShowAuth(false)} animatedMode={animatedMode} />}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-6">
        {/* Title */}
        <p
          className={`text-4xl md:text-5xl font-bold ${
            animatedMode ? "text-[#e5e5d9]" : "text-black"
          }`}
        >
          Ziyatron
        </p>

        {/* AskInput */}
        <div className="w-full max-w-3xl">
          <AskInputWrapper />
        </div>

        {/* Disclaimer */}
        <p
          className={`text-xs md:text-base transition-colors duration-300 ${
            animatedMode ? "text-[#e5e5d9]/70" : "text-gray-600"
          }`}
        >
          Ziyatron can make mistakes—please double-check important info.
        </p>
      </div>
    </div>
  );
}