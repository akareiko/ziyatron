'use client';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import logon from "../../../public/logon.png";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1); // 1 = email, 2 = password (and name if register)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      alert("Login successful!");
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
      setStep(1);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-white">
      <Image
        src={logon}
        alt="Logo"
        width={500}
        height={500}
        className="mb-6 mr-20"
      />
      <div className="p-6 rounded-2xl w-full max-w-sm flex flex-col gap-4 text-black">
        <h2 className="text-xl font-semibold text-center">Ziyatron</h2>

        {/* Step 1: Email input */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setStep(2);
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-200 rounded-full"
              required
            />
            <button
              type="submit"
              className="p-3 rounded-full bg-black text-white disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 2: Password (+ name if register) */}
        {step === 2 && (
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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-200 rounded-full"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 rounded-full bg-black text-white disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              {loading
                ? isRegister
                  ? "Registering..."
                  : "Logging in..."
                : isRegister
                ? "Register"
                : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-600 hover:underline"
            >
              Back
            </button>
          </form>
        )}

        {/* Toggle Register/Login */}
        {step === 2 && (
          <button
            className="text-sm self-center text-blue-600 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setPassword("");
              setName("");
            }}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        )}
      </div>
    </div>
  );
}