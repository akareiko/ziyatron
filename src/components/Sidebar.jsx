"use client";

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import SidebarAccount from "./SidebarAccount";
import { useParams } from "next/navigation";
import SidebarHeader from "./SidebarHeader";
import { getPatients, searchPatients } from "../lib/api";
import SearchPopup from "./SearchPopup";
import PatientList from "./PatientList";
import SidebarItem from "./SidebarItem";

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

export default function Sidebar({ collapsed, setCollapsed, onNewPatientClick, patients, setPatients, user, token, logout, error, newPatientId }) {
  const { patientId } = useParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [showBorder, setShowBorder] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = (e) => {
    setShowBorder(e.target.scrollTop > 0);
  };

  // ---------------------
  // Search patients securely
  // ---------------------
  useEffect(() => {
    if (!debouncedSearchTerm.trim() || !user || !token) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      setLoadingSearch(true);
      setError("");
      try {
        const data = await searchPatients(debouncedSearchTerm, token, {
          signal: controller.signal,
        });
        setSearchResults(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          setError("Failed to search patients.");
        }
      } finally {
        setLoadingSearch(false);
      }
    };

    search();
    return () => controller.abort();
  }, [debouncedSearchTerm, user, token]);

  return (
    <>
      <aside
        role="navigation"
        className={clsx(
          "top-0 left-0 z-40 h-screen pt-4 flex flex-col justify-between transition-all ease-out duration-300 sm:translate-x-0 -translate-x-full overflow-x-hidden rounded-3xl p-6 m-4 shadow-lg bg-white backdrop-blur-2xl",
          collapsed
            ? ""
            : "translate-x-0 bg-[#243c5a]/15 backdrop-blur-md shadow-lg rounded-2xl"
        )}
        aria-label="Sidebar"
      >
        <div className="h-full text-sm flex flex-col overflow-hidden">
          {/* Header + Menu */}
          <div
            className={clsx(
              "flex-shrink-0 px-2 overflow-hidden pb-4 pt-1 transition-colors duration-300",
              collapsed
                ? "border-transparent"
                : showBorder
                ? "border-b border-gray-300"
                : "border-transparent"
            )}
          >
            <SidebarHeader
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              scrollContainerRef={scrollContainerRef}
            />

            <div className="flex flex-col gap-2 mt-2">
              <SidebarItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                  </svg>
                }
                label="New patient"
                collapsed={collapsed}
                onClick={onNewPatientClick}
                aria-label="Add new patient"
              />
              <SidebarItem
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93ZM320-320v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T663-540L443-320H320Zm300-263-37-37 37 37ZM380-380h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                  </svg>
                }
                label="Search chats"
                collapsed={collapsed}
                onClick={() => setShowSearch(true)}
                aria-label="Search chats"
              />
            </div>
          </div>

          {/* Patient List */}
          {!collapsed && user && (
            <div
              className="flex-1 overflow-y-auto px-2"
              onScroll={handleScroll}
              ref={scrollContainerRef}
            >
              {error && (
                <p className="text-red-600 text-xs mb-2">{error}</p>
              )}
              <PatientList
                patients={patients}
                selectedChat={patientId}
                collapsed={collapsed}
                newPatientId={newPatientId}
              />
            </div>
          )}
        </div>

        <SidebarAccount
          collapsed={collapsed}
        />
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
    </>
  );
}