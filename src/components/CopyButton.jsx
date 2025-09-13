import { useState } from 'react';

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960" width="12px" fill="#000000ff">
      <path d="M760-200H320q-33 0-56.5-23.5T240-280v-560q0-33 23.5-56.5T320-920h280l240 240v400q0 33-23.5 56.5T760-200ZM560-640v-200H320v560h440v-360H560ZM160-40q-33 0-56.5-23.5T80-120v-560h80v560h440v80H160Zm160-800v200-200 560-560Z"/>
    </svg>
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