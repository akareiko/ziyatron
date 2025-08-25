import { useState, useRef, useLayoutEffect, useRef as useReactRef } from "react";

export default function AskInput({ onSend, onUploadClick }) {
  const [inputValue, setInputValue] = useState("");
  const [isBar, setIsBar] = useState(true);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const textareaRef = useRef(null);
  const prevIsBar = useReactRef(isBar);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setInputValue((prev) => prev + `📄 Uploaded: ${file.name}\n`);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend?.(inputValue.trim());
      setInputValue("");
    }
  };

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10) || 20;
    const visibleLines = Math.ceil(el.scrollHeight / lineHeight);
    const newIsBar = inputValue.trim() === "" || visibleLines <= 1;
    if (prevIsBar.current === false && newIsBar === true) {
      setTransitionEnabled(true);
    }
    if (prevIsBar.current === true && newIsBar === false) {
      setTransitionEnabled(false);
    }
    if (prevIsBar.current !== newIsBar) {
      setIsBar(newIsBar);
      prevIsBar.current = newIsBar;
    }
  }, [inputValue]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  }, [isBar]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto bg-white/40 backdrop-blur-xl shadow-xl border border-white/20 overflow-hidden`}
      style={{
        borderRadius: isBar ? "9999px" : "1rem",
        padding: isBar ? "0.5rem 0.75rem" : "0.75rem",
        transition: transitionEnabled
          ? "border-radius 0.3s ease, padding 0.3s ease"
          : "none",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className={`flex items-center gap-2 ${isBar ? "" : "mb-2"}`}>
        {isBar && (
          <button
            onClick={onUploadClick}
            className="p-2 hover:bg-black/10 rounded-full transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16M4 12h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={handleChange}
          placeholder="Type or drop a file..."
          className="flex-1 resize-none bg-transparent outline-none text-black placeholder-black scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
          style={{
            maxHeight: "150px",
            minHeight: isBar ? "1.5rem" : "2rem",
          }}
          rows={1}
        />

        {isBar && (
          <button
            onClick={handleSend}
            className="p-2 hover:bg-black/10 rounded-full transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {!isBar && (
        <div className="flex justify-between items-center mt-1 px-1">
          <button
            onClick={onUploadClick}
            className="p-2 hover:bg-black/10 rounded-full transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16M4 12h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleSend}
            className="p-2 hover:bg-black/10 rounded-full transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}