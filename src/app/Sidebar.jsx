'use client';
import { useState, useEffect, memo } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

// ---------------------
// Debounce hook
// ---------------------
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ---------------------
// SidebarItem component
// ---------------------
const SidebarItem = memo(({ icon, label, collapsed, onClick, selected }) => (
  <div
    onClick={onClick}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
    role="button"
    tabIndex={0}
    className={clsx(
      "flex items-center p-1.5 rounded-lg text-black cursor-pointer transition-colors duration-200 hover:bg-white/40 w-full",
      selected && "bg-white/40 shadow"
    )}
  >
    <span className="w-6 h-5 flex justify-center items-center flex-shrink-0">{icon}</span>
    <span
      className={clsx(
        "whitespace-nowrap overflow-hidden transition-all duration-200",
        collapsed ? "w-0 opacity-0 pointer-events-none ml-0" : "opacity-100 ml-2"
      )}
    >
      {label}
    </span>
  </div>
));

// ---------------------
// SidebarHeader (collapse button)
// ---------------------
function SidebarHeader({ collapsed, setCollapsed }) {
  return (
    <div className="mb-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center p-1.5 rounded-lg text-black hover:bg-white/40 cursor-pointer transition-colors duration-200 w-full"
        aria-label="Toggle sidebar"
        aria-pressed={collapsed}
      >
        <span className="w-6 h-5 flex justify-center items-center flex-shrink-0 text-gray-600">
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </span>
        <span className={clsx("whitespace-nowrap overflow-hidden transition-all duration-200", collapsed ? "w-0 opacity-0 pointer-events-none ml-0" : "opacity-100 ml-2")}>
          Collapse
        </span>
      </button>
    </div>
  );
}

// ---------------------
// PatientList component
// ---------------------
const PatientList = memo(({ patients, selectedChat, setSelectedChat, collapsed }) => (
  <div className="mt-8">
    <h4 className={clsx(
      "mb-2 p-1.5 text-gray-500 transition-all duration-200 overflow-hidden whitespace-nowrap",
      collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
    )}>
      Patients
    </h4>
    <ul role="list" className="flex flex-col gap-1">
      {patients.map((patient) => (
        <li key={patient.id}>
          <Link
            href={`/chat/${patient.id}`}
            className={clsx(
              "flex items-center p-1.5 rounded-lg text-black hover:bg-white/40 cursor-pointer transition gap-3 w-full",
              selectedChat === patient.id && "bg-white/40 shadow"
            )}
            onClick={() => setSelectedChat(patient.id)}
          >
            <span className={clsx(
              "whitespace-nowrap overflow-hidden transition-all duration-200",
              collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2"
            )}>
              {patient.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

// ---------------------
// SidebarAccount
// ---------------------
function SidebarAccount({ onClick }) {
  const { user, logout } = useAuth();
  return (
    <div onClick={onClick} className="cursor-pointer">
      {user ? (
        <div className="flex items-center gap-2">
          <img src={user.photoURL || "/default.png"} className="w-8 h-8 rounded-full" />
          <span>{user.name || user.email}</span>
          <button onClick={logout} className="ml-2 text-sm text-red-500 hover:underline">Logout</button>
        </div>
      ) : (
        <span>Login</span>
      )}
    </div>
  );
}

// ---------------------
// AuthPopup
// ---------------------
function AuthPopup({ setShowAuth }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setShowAuth(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowAuth(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowAuth(false)} className="absolute top-3 right-3">✕</button>
        <h2 className="text-lg font-semibold mb-4">Sign in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="p-2 rounded border" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="p-2 rounded border" />
          <button type="submit" className="bg-black text-white py-2 rounded">Login</button>
        </form>
      </div>
    </div>
  );
}

// ---------------------
// SearchPopup component
// ---------------------
function SearchPopup({ searchTerm, setSearchTerm, searchResults, setSearchResults, loadingSearch, setShowSearch, setSelectedChat }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onKeyDown={(e) => e.key === "Escape" && setShowSearch(false)}
      tabIndex={-1}
    >
      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl h-[80vh] flex flex-col relative">
        {/* Close button */}
        <button
          onClick={() => setShowSearch(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition"
          aria-label="Close search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patient chats..."
          className="w-full p-3 rounded-lg bg-white/60 text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-black/30"
        />

        <div className="mt-6 flex-1 overflow-y-auto space-y-2">
          {loadingSearch && <div className="text-gray-600">Searching...</div>}
          {searchResults.length > 0 &&
            searchResults.map((msg) => (
              <Link
                key={msg.message_id || msg.patient_id}
                href={`/chat/${msg.patient_id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 text-black text-sm transition"
                onClick={() => {
                  setSelectedChat(msg.patient_id);
                  setSearchTerm("");
                  setSearchResults([]);
                  setShowSearch(false);
                }}
              >
                <span className="w-6 h-6 flex-shrink-0 flex justify-center items-center bg-gray-300 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h4m-2 4a9 9 0 100-18 9 9 0 000 18z" />
                  </svg>
                </span>
                <span className="font-medium">{msg.patient_name || msg.role || "Unknown Patient"}</span>
                <span className="text-gray-600 truncate flex-1">{msg.content.slice(0, 60)}...</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------
// Authenticated fetch helper
// ---------------------
async function authFetch(url, options = {}, token) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 401) throw new Error("Unauthorized");
  return res.json();
}

// ---------------------
// Main Sidebar component
// ---------------------
export default function Sidebar({ collapsed, setCollapsed, onNewPatientClick }) {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { authFetch } = useAuth();

  // Fetch patients securely
  useEffect(() => {
    if (!user) return;
    const fetchPatients = async () => {
      try {
        const data = await authFetch('http://127.0.0.1:5000/patients');
        setPatients(data);
      } catch (err) {
        console.error(err);
        if (err.message === "Unauthorized") logout();
      }
    };
    fetchPatients();
  }, [user]);

  // Search patients securely
  useEffect(() => {
    if (!debouncedSearchTerm.trim() || !user) return setSearchResults([]);
    const search = async () => {
      setLoadingSearch(true);
      try {
        const data = await authFetch(`http://127.0.0.1:5000/search?q=${encodeURIComponent(debouncedSearchTerm)}`, {}, localStorage.getItem("token"));
        setSearchResults(data);
      } catch (err) {
        console.error(err);
        if (err.message === "Unauthorized") logout();
      } finally {
        setLoadingSearch(false);
      }
    };
    search();
  }, [debouncedSearchTerm, user]);

  return (
    <>
      <aside
        className={clsx(
          "top-0 left-0 z-40 h-screen pt-4 flex flex-col justify-between transition-all ease-out duration-300 sm:translate-x-0 -translate-x-full overflow-x-hidden",
          collapsed ? "" : "translate-x-0 bg-[#243c5a]/15 backdrop-blur-md shadow-lg"
        )}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 overflow-y-auto text-sm flex flex-col">
          <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />

          {/* Menu */}
          <div className="flex flex-col gap-2">
            <SidebarItem
              icon={<span className="w-5 h-5 bg-gray-300 rounded-full" />}
              label="New patient"
              collapsed={collapsed}
              onClick={onNewPatientClick}
            />
            <SidebarItem
              icon={<span className="w-5 h-5 bg-gray-300 rounded-full" />}
              label="Search chats"
              collapsed={collapsed}
              onClick={() => setShowSearch(true)}
            />
          </div>

          {!collapsed && user && (
            <PatientList patients={patients} selectedChat={selectedChat} setSelectedChat={setSelectedChat} collapsed={collapsed} />
          )}
        </div>

        {!collapsed && <SidebarAccount onClick={() => setShowAuth(true)} />}
      </aside>

      {showSearch && (
        <SearchPopup
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          loadingSearch={loadingSearch}
          setShowSearch={setShowSearch}
          setSelectedChat={setSelectedChat}
        />
      )}

      {showAuth && <AuthPopup setShowAuth={setShowAuth} />}
    </>
  );
}