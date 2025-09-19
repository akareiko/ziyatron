import AskInput from "./AskInput";
import { useChat } from "../context/ChatContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPatients } from "../lib/api";
import ChatHeader from "./ChatHeader";
import Dashboard from "./Dashboard";
import BlurEffect from "react-progressive-blur";

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

// ----------------------------
// RightPanel Component
// ----------------------------
export default function RightPanel({
  children,
  patientId,
  externalFile,
  clearExternalFile,
  showModal,
  setShowModal,
  onNewPatientAdded,
  rightExpanded,
  setRightExpanded,
}) {
  const { patients } = usePatients();
  const patient = patients.find((p) => p.id === patientId);

  return (
    <div
      className="relative rounded-3xl flex flex-col h-full"
    >
      {/* Main chat + right panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div
          className="overflow-hidden flex flex-col transition-all duration-300"
          style={{
            flex: rightExpanded ? "0 0 80%" : "0 0 100%",
          }}
        >
          <div className="flex flex-col justify-end h-full w-full relative">
            {/* Chat header */}
            {patient && (
              <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
                <div className="w-full max-w-3xl">
                  <ChatHeader
                  patientName={patient.name}
                  patientId={patientId}
                  rightExpanded={rightExpanded}
                  setRightExpanded={setRightExpanded}
                />
                </div>
              </div>
            )}

            {/* Chat messages area */}
            <div className="flex-1 overflow-auto">
              {!patientId ? (
                <Dashboard
                  showModal={showModal}
                  setShowModal={setShowModal}
                  onNewPatientAdded={onNewPatientAdded}
                />
              ) : (
                <div className="flex-1 overflow-auto flex justify-center">
                  <div className="w-full max-w-3xl">
                    {children}
                  </div>
                </div>
              )}
            </div>

            {/* AskInputWrapper */}
            {patientId && (
              <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
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
        </div>

        {/* Right panel details */}
        {rightExpanded && patient && (
          <div className="transition-all duration-300 w-[20%] p-4 overflow-y-auto z-30">
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-gray-600">
              {patient.condition || "No condition provided"}
            </p>
            {/* Extra details can go here */}
          </div>
        )}
      </div>
    </div>
  );
}