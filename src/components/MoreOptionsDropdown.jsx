// app/components/MoreOptionsDropdown.jsx
'use client';
import { useState } from "react";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { createPortal } from "react-dom";
import ConfirmDialog from "./ConfirmDialog";
import { useEffect } from "react";

export default function MoreOptionsDropdown({ patient = null }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-end",
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
  if (!showConfirm) return;
  const handleEsc = (e) => {
    if (e.key === "Escape") setShowConfirm(false);
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, [showConfirm]);

  return (
    <>
      {/* Trigger button (three dots) */}
      <button
        ref={refs.setReference}
        onClick={() => setOpenMenu((o) => !o)}
        className="p-2 rounded-xl hover:bg-black/10 transition"
        aria-label="More options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="#000000ff"
        >
          <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 
            23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 
            33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 
            23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 
            33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 
            23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 
            33-23.5 56.5T720-400Z"/>
        </svg>
      </button>

      {/* Dropdown menu */}
      {openMenu &&
        createPortal(
          <ul
            ref={refs.setFloating}
            style={floatingStyles}
            className="w-48 bg-white border border-gray-300 shadow-md rounded-xl overflow-hidden z-[9999] p-1"
          >
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer rounded-xl"
              onClick={() => {
                setOpenMenu(false);
                alert(`Share ${patient?.name ?? "chat"}`);
              }}
            >
              Share
            </li>
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer rounded-xl"
              onClick={() => {
                setOpenMenu(false);
                alert(`Edit ${patient?.name ?? "chat"}`);
              }}
            >
              Edit
            </li>
            <li>
              <hr className="border-t border-gray-300 mx-4 my-1" />
            </li>
            <li
              className="flex items-center gap-2 px-4 py-2 text-red-600 text-sm hover:bg-gray-100 cursor-pointer rounded-xl"
              onClick={() => {
                setOpenMenu(false);
                setShowConfirm(true);
              }}
            >
              Delete
            </li>
          </ul>,
          document.body
        )}

      {/* Confirm dialog */}
      <ConfirmDialog
        open={showConfirm}
        title="Delete Chat"
        message={`Are you sure you want to delete ${patient?.name ?? "this chat"}?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          alert(`Deleted ${patient?.name ?? "chat"}`);
          // TODO: hook into API / state update
        }}
      />
    </>
  );
}