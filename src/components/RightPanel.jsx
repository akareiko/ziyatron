import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import { useChat } from "../context/ChatContext";
import Link from "next/link";
import MoreOptionsDropdown from "./MoreOptionsDropdown";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPatients } from "../lib/api";

// ----------------------------
// Custom hook for fetching patients
// ----------------------------
function usePatients() {
  const { user, token, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPatients(token);
        setPatients(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch patients");
        if (err.message === "Unauthorized") logout();
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user, token, logout]);

  return { patients, loading, error };
}

// ----------------------------
// Chat Header
// ----------------------------
function ChatHeader({ title, patientId }) {
  return (
    <div className="relative pb-4 mb-0 border-b border-gray-300">
  <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
  {patientId && (
    <div className="absolute right-0 top-0 flex items-center gap-3">
      <ShareButton />
      <MoreOptionsDropdown patient={patientId} />
    </div>
  )}
</div>
  );
}

// Share Button with fallback
function ShareButton() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Ziyatron", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <button
      className="p-2 rounded-xl hover:bg-black/10 transition flex flex-row"
      aria-label="Share patient chat"
      onClick={handleShare}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff">
        <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/>
      </svg>
      <p className="text-black pl-1">Share</p>
    </button>
  );
}

// ----------------------------
// AskInput Wrapper
// ----------------------------
function AskInputWrapper({ patientId, externalFile, clearExternalFile }) {
  const { sendMessage } = useChat();

  return (
    <AskInput
      onSend={(payload) => sendMessage(patientId, payload)}
      externalFile={externalFile}
      onExternalFileHandled={clearExternalFile}
    />
  );
}

// ----------------------------
// Patient Grid (when no patient selected)
// ----------------------------
function PatientGrid() {
    const { patients, loading, error } = usePatients();

  if (loading) return <p className="text-center mt-6">Loading patients...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;
  if (patients.length === 0) return <p className="text-center mt-6">No patients found</p>;

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

export default function RightPanel( { children, patientId, externalFile, clearExternalFile, showModal, setShowModal, onNewPatientAdded } ) {
  return (
    <>
     <NewPatientModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onNewPatientAdded={onNewPatientAdded}
    />
    
    <div className="relative rounded-3xl m-4 shadow-lg bg-white backdrop-blur-2xl flex flex-col h-full pt-4 pr-6 pl-6 pb-12" style={{ height: 'calc(100% - 2rem)' }}>
    <ChatHeader title="Ziyatron" patientId={patientId} />

    <div className="overflow-auto flex flex-col items-center">
        <div className="w-full max-w-3xl">
        {!patientId ? (
            <div className="flex flex-col items-center text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Create new patient</h3>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-4 mb-6 rounded-full bg-black/10 hover:bg-black/20 transition"
                aria-label="Create new patient"
            >
                <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <p className="text-xl font-semibold mb-4">or choose from patients</p>
            <PatientGrid/>
            </div>
        ) : (
            <div aria-live="polite" className="w-full h-full">
            {children}
            </div>
        )}
        </div>
    </div>

    {patientId && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="w-full max-w-3xl">
            <AskInputWrapper
            patientId={patientId}
            externalFile={externalFile}
            clearExternalFile={clearExternalFile}
            />
        </div>
        </div>
    )}
    </div>
    </>
  );
}