'use client';
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./context/AuthContext";
import clsx from "clsx";
import { useFloating, offset, flip, shift, autoUpdate } from "@floating-ui/react";

export default function SidebarAccount({ collapsed }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleLogout = () => {
    logout();
    window.location.href = "http://localhost:3000";
  };

//   if (!user)
//     return (
//       <span
//         className="cursor-pointer w-full flex justify-center p-2"
//         onClick={() => alert("Please login")}
//       >
//         Login
//       </span>
//     );

  const initial = (user.name || user.email || "U")[0].toUpperCase();
  const colorHash = Array.from(user.email || "user").reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const colors = ["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa"];
  const bgColor = colors[colorHash % colors.length];

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key !== "Escape") return;

      if (confirmLogout) {
        setConfirmLogout(false);
      } else if (open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, confirmLogout]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
        const refEl = refs.reference.current;
        const floatingEl = refs.floating.current;

        // if click is inside account button or dropdown, do nothing
        if (refEl?.contains(e.target) || floatingEl?.contains(e.target)) return;

        // otherwise close dropdown
        setOpen(false);
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [open, refs]);

  return (
    <>
      {/* Account button */}
      <div className="relative w-full" ref={refs.setReference}>
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center h-12 px-3.5 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-black/10 w-full"
        >
          {/* Avatar */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-sm font-light flex-shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {initial}
          </div>

          {/* Name */}
          <span
            className={clsx(
              "ml-2 transition-all duration-200 truncate",
              collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}
          >
            {user.name || user.email}
          </span>
        </div>

        {/* Dropdown menu */}
        {open &&
          createPortal(
            <ul
              ref={refs.setFloating}
              style={floatingStyles}
              className="w-60 bg-white rounded-xl overflow-hidden z-[9999] p-1 shadow-lg"
            >
              <li className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm hover:bg-gray-100 rounded-xl cursor-default">
                {user.email}
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-xl cursor-pointer"
                onClick={() => alert("Settings clicked")}
              >
                Settings
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-xl cursor-pointer"
                onClick={() => alert("Help clicked")}
              >
                Help
              </li>
              <li>
                <hr className="border-t border-gray-300 mx-4 my-1" />
              </li>
              <li
                className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-xl cursor-pointer"
                onClick={() => {
                  setOpen(false); // close menu first
                  setConfirmLogout(true);
                }}
              >
                Log out
              </li>
            </ul>,
            document.body
          )}
      </div>

      {/* Logout confirmation popup */}
      {confirmLogout &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-100/30 backdrop-blur-[0.5px] text-black"
            onClick={() => setConfirmLogout(false)}
          >
            <div
              className="w-full max-w-sm p-6 rounded-2xl bg-white flex flex-col gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setConfirmLogout(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10"
                aria-label="Close modal"
              >
                ✕
              </button>
              <h2 className="text-xl font-light mb-2">Confirm Logout</h2>
              <p>Are you sure you want to log out?</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Yes, log out
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}