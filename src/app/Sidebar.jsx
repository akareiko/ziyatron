import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";

function SidebarItem({ icon, label, collapsed, onClick, selected }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      role="button"
      tabIndex={0}
      className={clsx(
        "flex items-center p-2 rounded-lg text-black cursor-pointer",
        "hover:bg-white/40",
        selected ? "bg-white/40 shadow" : "",
        "transition-colors duration-200"
      )}
    >
      {/* Icon container fixed size */}
      <span className="w-6 h-5 flex justify-center items-center flex-shrink-0">
        {icon}
      </span>

      {/* Label hidden visually but keeps space */}
      <span
        className={clsx(
          "ml-2 whitespace-nowrap transition-opacity duration-200",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default function Sidebar({ collapsed, setCollapsed, onNewPatientClick }) {
  const [patients, setPatients] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/patients");
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <aside
      className={clsx(
        "top-0 left-0 z-40 h-screen pt-4 flex flex-col justify-between transition-all ease-out duration-300",
        "sm:translate-x-0 -translate-x-full",
        collapsed ? "" : "translate-x-0 bg-white/25 backdrop-blur-md shadow-lg"
      )}
      aria-label="Sidebar"
    >
      {/* Top part */}
      <div className="h-full px-4 overflow-y-auto text-sm flex flex-col">
        <div className="mb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={clsx(
              "flex items-center p-2 rounded-lg text-black hover:bg-white/40 cursor-pointer transition-colors duration-200 w-full"
            )}
            aria-label="Toggle sidebar"
          >
            {/* Icon container fixed size */}
            <span className="w-6 h-5 flex justify-center items-center flex-shrink-0 text-gray-600">
              {collapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </span>

            {/* Label hidden visually when collapsed */}
            <span
              className={clsx(
                "ml-2 whitespace-nowrap transition-opacity duration-200",
                collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              Collapse
            </span>
          </button>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2">
          <SidebarItem
            icon={
              <svg
                className="w-5 h-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="black"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
              </svg>
            }
            label="New Patient"
            collapsed={collapsed}
            onClick={onNewPatientClick}
          />
          <SidebarItem
            icon={
              <svg
                className="w-5 h-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                fill="black"
              >
                <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            }
            label="Search Chats"
            collapsed={collapsed}
          />
        </div>

        {/* Chats */}
        {!collapsed && (
          <div className="mt-8">
            <h4 className="mb-2 p-2 text-black">Chats</h4>
            <ul className="flex flex-col gap-2">
              {patients.map((patient) => (
                <li key={patient.id}>
                  <Link
                    href={`/chat/${patient.id}`}
                    className={clsx(
                      "flex items-center p-2 rounded-lg text-black hover:bg-white/40 cursor-pointer transition gap-3",
                      selectedChat === patient.id ? "bg-white/40 shadow" : ""
                    )}
                    onClick={() => setSelectedChat(patient.id)}
                  >
                    <span
                      className={clsx(
                        "transition-all duration-200 overflow-hidden whitespace-nowrap",
                        collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-xs"
                      )}
                    >
                      {patient.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom account placeholder */}
      {!collapsed && (
        <div className="flex items-center gap-3 p-2 mx-4 mb-2 rounded-lg hover:bg-white/20 hover:shadow">
          <div className="w-10 h-10 rounded-full bg-gray-600" />
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="truncate font-medium text-black">John Doe</span>
            <span className="text-xs text-gray-600 truncate">Account</span>
          </div>
          <button className="text-black hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}