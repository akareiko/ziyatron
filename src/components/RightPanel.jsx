import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import { useChat } from "../context/ChatContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPatients } from "../lib/api";
import ChatHeader from "./ChatHeader";
import PatientGrid from "./PatientGrid";

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


export default function RightPanel( { children, patientId, externalFile, clearExternalFile, showModal, setShowModal, onNewPatientAdded, patient } ) {
  return (
    <>
     <NewPatientModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onNewPatientAdded={onNewPatientAdded}
    />
    
    <div className="relative rounded-3xl border border-gray-300 m-4 shadow-lg bg-white backdrop-blur-2xl flex flex-col h-full pt-2 pr-6 pl-6 pb-12" style={{ height: 'calc(100% - 2rem)' }}>
      <ChatHeader title={patient.name} patientId={patientId} />

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