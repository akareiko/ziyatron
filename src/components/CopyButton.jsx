import { useState } from 'react';

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#000000ff"><path d="M160-80q-33 0-56.5-23.5T80-160v-480q0-33 23.5-56.5T160-720h80v-80q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240h-80v80q0 33-23.5 56.5T640-80H160Zm160-240h480v-480H320v480Z"/></svg>
  );
}

export default function CopyButton({ text }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
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

      {(hover || copied) && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded text-xs text-white bg-black/80 whitespace-nowrap shadow z-[9999]">
          {copied ? "Copied!" : "Copy"}
        </div>
      )}
    </div>
  );
}