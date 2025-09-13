'use client';
import { useState, useRef, useEffect } from "react";
import SplineBackground from "../components/Splinebg";
import Link from "next/link";
import DragDropOverlay from "../components/DragDropOverlay";
import EphemeralAskInput from "../components/EphemeralAskInput";

export default function LandingPage() {
  const [animatedMode, setAnimatedMode] = useState(true);
  const [firstMessageSent, setFirstMessageSent] = useState(false);

  const handleGlobalFileDrop = (file) => {
    console.log("Dropped file:", file);
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        animatedMode ? "text-gray-200 bg-white" : "text-black bg-gray-100"
      }`}
    >
      {animatedMode && <SplineBackground />}

      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setAnimatedMode(!animatedMode)}
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
            animatedMode
              ? "bg-white text-black"
              : "bg-black text-white border hover:bg-gray-200"
          }`}
          aria-label="Toggle theme"
        >
          Z
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <Link href="/login">
          <button
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              animatedMode ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            Sign In
          </button>
        </Link>
      </div>

      <div
        className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 pb-30 ${
          firstMessageSent
            ? "top-4 text-4xl md:text-3xl"
            : "top-1/2 -translate-y-1/2 text-4xl md:text-5xl"
        } font-bold text-center ${
          animatedMode ? "text-white" : "text-black"
        }`}
      >
        Ziyatron
      </div>

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

      <DragDropOverlay onFileDrop={handleGlobalFileDrop} />
    </div>
  );
}