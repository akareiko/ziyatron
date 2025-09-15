import { useEffect, useRef } from "react";
import Link from "next/link";

export default function SearchPopup({
  searchTerm,
  setSearchTerm,
  searchResults,
  setSearchResults,
  loadingSearch,
  setShowSearch,
}) {
  const popupRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setShowSearch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSearch]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" tabIndex={-1}>
      <div
        ref={popupRef}
        className="w-full max-w-xl bg-white/30 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl h-[50vh] flex flex-col relative"
      >
        {/* Close button */}
        <button
          onClick={() => setShowSearch(false)}
          className="absolute top-2.5 right-2.5 p-2 rounded-full hover:bg-black/10 transition"
          aria-label="Close search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patient chats..."
          className="w-full p-5 border-b border-gray-300 text-black placeholder-gray-700 focus:outline-none"
        />

        <div className="flex-1 overflow-y-auto space-y-2">
          {/* {loadingSearch && <div className="text-gray-600">Searching...</div>} */}
          {searchResults.length > 0 &&
            searchResults.map((msg) => (
              <Link
                key={msg.message_id || msg.patient_id}
                href={`/chat/${msg.patient_id}`}
                className="flex items-center gap-3 m-2 p-3 rounded-xl hover:bg-black/5 text-black text-sm transition"
                onClick={() => {
                  setSearchTerm("");
                  setSearchResults([]);
                  setShowSearch(false);
                }}
              >
                <span className="w-6 h-6 flex-shrink-0 flex justify-center items-center bg-gray-300 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 8h10M7 12h6m-6 4h4m-2 4a9 9 0 100-18 9 9 0 000 18z"
                    />
                  </svg>
                </span>
                <span className="font-medium">{msg.patient_name || msg.role || "Unknown Patient"}</span>
                <span className="text-gray-600 truncate flex-1">
                  {typeof msg.content === "string" ? msg.content.slice(0, 60) : JSON.stringify(msg.content).slice(0, 60)}...
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}