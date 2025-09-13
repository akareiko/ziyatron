'use client';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPopup({ setShowAuth }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter email and password");

    try {
      await login(email, password);
      setShowAuth(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setShowAuth(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={() => setShowAuth(false)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowAuth(false)}
          className="absolute top-3 right-3"
          aria-label="Close auth modal"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Sign in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-2 rounded border"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 rounded border"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="bg-black text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}