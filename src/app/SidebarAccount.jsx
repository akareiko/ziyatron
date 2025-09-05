import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "./context/AuthContext";
import clsx from "clsx";

export default function SidebarAccount({ onClick, collapsed }) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.href = "http://localhost:3000";
  };

  if (!user)
    return (
      <span
        className="cursor-pointer w-full flex justify-center p-2"
        onClick={() => alert("Please login")}
      >
        Login
      </span>
    );

  const initial = (user.name || user.email || "U")[0].toUpperCase();
  const colorHash = Array.from(user.email || "user").reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const colors = ["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa"];
  const bgColor = colors[colorHash % colors.length];

  // Close dropdown on Escape
  useEffect(() => {
    if (!showMenu) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showMenu]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <>
      {/* Account button */}
      <div className="relative w-full">
        <div
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center h-12 px-3.5 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-black/10 w-full"
            >
            {/* Avatar */}
            <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-sm font-light flex-shrink-0"
                style={{ backgroundColor: bgColor }}
            >
                {initial}
            </div>

            {/* Name: keep width even when collapsed */}
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
        {showMenu && (
          <ul
            ref={menuRef}
            className="absolute bottom-full left-1/2 w-60 bg-white rounded-xl overflow-hidden z-50 transform -translate-x-1/2 py-2 shadow-lg"
          >
            <li className="flex items-center gap-2 px-4 py-2 text-gray-500 text-sm hover:bg-gray-100 rounded-xl w-[90%] ml-3 my-1">
              {user.email}
            </li>
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-xl w-[90%] ml-3 my-1 cursor-pointer"
              onClick={() => alert("Settings clicked")}
            >
              Settings
            </li>
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-xl w-[90%] ml-3 my-1 cursor-pointer"
              onClick={() => alert("Help clicked")}
            >
              Help
            </li>
            <li>
              <hr className="border-t border-gray-300 mx-4 my-1" />
            </li>
            <li
              className="flex items-center gap-2 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-xl w-[90%] ml-3 my-1 cursor-pointer"
              onClick={() => setConfirmLogout(true)}
            >
              Log out
            </li>
          </ul>
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