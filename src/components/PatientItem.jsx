import { useState, useEffect } from "react";
import Link from "next/link";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";
import { createPortal } from "react-dom";
import ConfirmDialog from "./ConfirmDialog";

export default function PatientItem ({ patient, collapsed, selectedChat, setSelectedChat }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Typewriter effect
  const [typedName, setTypedName] = useState("");
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedName(patient.name.slice(0, index + 1));
      index++;
      if (index === patient.name.length) clearInterval(interval);
    }, 100); // typing speed in ms
    return () => clearInterval(interval);
  }, [patient.name]);

  const { refs, floatingStyles } = useFloating({
    open: openMenu,
    onOpenChange: setOpenMenu,
    placement: "top-end",
    strategy: "fixed",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!openMenu) return;
    const handleClickOutside = (e) => {
      if (refs.reference.current?.contains(e.target) || refs.floating.current?.contains(e.target)) return;
      setOpenMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu, refs]);

  useEffect(() => {
    if (!showConfirm) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowConfirm(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showConfirm]);

  return (
    <li className="relative group">
      <Link
        href={`/chat/${patient.id}`}
        ref={refs.setReference}
        className={`flex items-center p-1.5 rounded-xl cursor-pointer transition gap-0 w-full ${
          selectedChat === patient.id ? "bg-black/5" : "hover:bg-black/5"
        }`}
      >
        <span
          className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
            collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100"
          }`}
        >
          {typedName}
        </span>

        {!collapsed && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenMenu((prev) => !prev);
            }}
            className="ml-auto p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
            aria-label="More options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentcolor">
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/>
            </svg>
          </button>
        )}
      </Link>

      {openMenu &&
        createPortal(
          <ul
            ref={refs.setFloating}
            style={floatingStyles}
            className="w-48 bg-white border border-gray-300 shadow-md rounded-xl overflow-hidden z-[9999] p-1"
          >
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer rounded-xl"
              onClick={() => alert(`Share ${patient.name}`)}
            >
              Share
            </li>
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer rounded-xl"
              onClick={() => alert(`Edit ${patient.name}`)}
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
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Action"
        message="Are you sure you want to perform this action?"
        confirmLabel="Yes"
        cancelLabel="No"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          alert(`Deleted ${patient.name}`);
        }}
      />
    </li>
  );
};