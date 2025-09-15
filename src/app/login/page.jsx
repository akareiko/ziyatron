"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import logon from "../../../public/logon.png";
import { registerUser } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password.trim());
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await registerUser({
        email: email.trim(),
        password: password.trim(),
        name: name.trim(),
      });
      setSuccess("Registration successful! You can now log in.");
      setIsRegister(false);
      setStep(1);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <span className="absolute flex flex-row items-center top-10">
        <svg width="24px" height="24px" viewBox="0 0 679 592" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M564.765 440C488.279 440 435.84 364.92 462.123 293.091L569.006 1V1C644.789 1 697.498 76.3487 671.514 147.538L564.765 440Z" fill="black"/>
          <path d="M97.6049 591C30.0284 591 -16.7693 523.535 6.90204 460.24L119 160.5C186.573 160.598 231.66 229.611 208.5 293.091L97.6049 591V591Z" fill="black"/>
          <path d="M162.18 524.022C150.415 556.612 174.56 591 209.209 591H506L517.8 561C427.804 561 367.108 471.175 397.052 386.306L509.489 67.6364C520.966 35.1062 496.833 1 462.337 1H176.8L165 31C256.831 31 305.912 123.674 275.439 210.301L162.18 524.022Z" fill="black"/>
          <path d="M564.765 440C488.279 440 435.84 364.92 462.123 293.091L569.006 1V1C644.789 1 697.498 76.3487 671.514 147.538L564.765 440Z" stroke="black"/>
          <path d="M97.6049 591C30.0284 591 -16.7693 523.535 6.90204 460.24L119 160.5C186.573 160.598 231.66 229.611 208.5 293.091L97.6049 591V591Z" stroke="black"/>
          <path d="M162.18 524.022C150.415 556.612 174.56 591 209.209 591H506L517.8 561C427.804 561 367.108 471.175 397.052 386.306L509.489 67.6364C520.966 35.1062 496.833 1 462.337 1H176.8L165 31C256.831 31 305.912 123.674 275.439 210.301L162.18 524.022Z" stroke="black"/>
        </svg>
        <p className="text-2xl ml-2 text-black font-bold">Ziyatron</p>
      </span>

      <p className="text-5xl mt-10 ml-2 text-black font-bold">Ready to dive in?</p>

      <div className="p-6 mt-10 border border-gray-300 rounded-2xl w-full max-w-sm flex flex-col gap-4 text-black shadow-lg">
        <h2 className="text-2xl text-center">Login</h2>

        {/* Error / Success Messages */}
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center bg-green-100 p-2 rounded">
            {success}
          </p>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setStep(2);
            }}
            className="flex flex-col gap-3"
          >
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
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
              <>
                <label className="sr-only" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 border border-gray-200 rounded-full"
                  required
                />
              </>
            )}

            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
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
              className="p-3 rounded-full bg-black text-white disabled:opacity-50 hover:bg-gray-700 transition-colors flex justify-center"
              aria-busy={loading}
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : isRegister ? (
                "Register"
              ) : (
                "Login"
              )}
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