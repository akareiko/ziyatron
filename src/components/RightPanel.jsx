import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import { useChat } from "../context/ChatContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPatients } from "../lib/api";
import ChatHeader from "./ChatHeader";
import Dashboard from "./Dashboard"

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


export default function RightPanel( { children, patientId, externalFile, clearExternalFile, showModal, setShowModal, onNewPatientAdded } ) {
  const { patients } = usePatients();
  const patient = patients.find(p => p.id === patientId);
  return (
    <>
      <div className="relative rounded-3xl border border-gray-300 m-4 shadow-lg bg-white backdrop-blur-2xl flex flex-col h-full pt-2 pr-6 pl-6 pb-12" style={{ height: 'calc(100% - 2rem)' }}>
        {patient ? (
          <ChatHeader title={patient ? patient.name || `Patient #${patient.id}` : "No patient selected"} patientId={patientId} />
        ) : (
          <></>
        )}

        <div className="overflow-auto flex flex-col items-center">
            <div className="w-full max-w-3xl">
            {!patientId ? (
                <Dashboard showModal={showModal} setShowModal={setShowModal} onNewPatientAdded={onNewPatientAdded}/>
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