'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import DragDropOverlay from "./DragDropOverlay";
import { useParams } from "next/navigation";
import { useChat } from "./context/ChatContext";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Link from "next/link";
import MoreOptionsDropdown from "./MoreOptionsDropdown";

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [externalFile, setExternalFile] = useState(null);
  
  const { patientId } = useParams(); // null/undefined on "/"

  function ChatHeader({ title }) {
    return (
      <div className="flex items-center justify-between pb-4 mb-0 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {patientId && (
          <div className="flex items-center gap-3">
            {/* Share button */}
            <button
              className="p-2 rounded-xl hover:bg-black/10 transition flex flex-row"
              aria-label="Share"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff">
                <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/>
              </svg>
              <p className="text-black pl-1">Share</p>
            </button>
            {/* More options */}
            <MoreOptionsDropdown patient={patientId} />
          </div>
        )}
      </div>
    );
  }

  const handleGlobalFileDrop = (file) => {
    setExternalFile(file);
  };

  return (
    <div className="relative min-h-screen text-black bg-gradient-to-br from-white via-blue-200/80 to-gray-100">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl z-0" />
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${collapsed ? "w-[9%]" : "w-[20%]"} flex flex-col h-full`}>
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onNewPatientClick={() => setShowModal(true)}
          />
        </div>

        {/* Right panel */}
        <div className={`transition-all duration-300 ${collapsed ? "w-[91%]" : "w-[80%]"} flex flex-col h-full`}>
          <NewPatientModal isOpen={showModal} onClose={() => setShowModal(false)} />

          {/* Content wrapper */}
          <div
            className="relative rounded-3xl m-4 shadow-lg bg-white/40 backdrop-blur-2xl flex flex-col h-full pt-4 pr-6 pl-6 pb-12"
            style={{ height: 'calc(100% - 2rem)' }}
          >
            <ChatHeader title="Ziyatron" />

            <div className="flex-1 overflow-auto flex flex-col items-center">
              <div className="w-full max-w-3xl px-4">
                {/* If no patient selected */}
                {!patientId ? (
                  <div className="flex flex-col items-center text-center mt-12">
                    <h3 className="text-xl font-semibold mb-4">Create new patient</h3>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-4 mb-6 rounded-full bg-black/10 hover:bg-black/20 transition"
                    >
                      <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <p className="text-xl font-semibold mb-4">or choose from patients</p>

                    {/* Grid of patients */}
                    <PatientGrid />
                  </div>
                ) : (
                  children // normal chat page
                )}
              </div>
            </div>

            {/* AskInput only if patient is selected */}
            {patientId && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                <div className="w-full max-w-3xl px-4">
                  <AskInputWrapper
                    externalFile={externalFile}
                    clearExternalFile={() => setExternalFile(null)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global DragDropOverlay */}
      <DragDropOverlay onFileDrop={handleGlobalFileDrop} />
    </div>
  );
}

function AskInputWrapper({ externalFile, clearExternalFile }) {
  const { sendMessage } = useChat();
  const { patientId } = useParams();

  return (
    <AskInput
      onSend={(payload) => sendMessage(patientId, payload)}
      onUploadClick={() => {}}
      externalFile={externalFile}
      onExternalFileHandled={() => clearExternalFile()}
    />
  );
}

// Placeholder PatientGrid — use your sidebar patients source
function PatientGrid() {
  const [patients, setPatients] = useState([]);
  const { user, logout } = useAuth();
  const { authFetch } = useAuth();

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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {patients.map((p) => (
        <Link
          key={p.id}
          href={`/chat/${p.id}`}
          className="p-4 bg-white rounded-xl shadow hover:shadow-md cursor-pointer"
        >
          <p className="font-medium">{p.name}</p>
        </Link>
      ))}
    </div>
  );
}