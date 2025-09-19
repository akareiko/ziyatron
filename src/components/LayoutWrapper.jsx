'use client';

import { useState} from "react";
import { useParams } from "next/navigation";
import Sidebar from "./Sidebar";
import DragDropOverlay from "./DragDropOverlay";
import RightPanel from "./RightPanel";
import { getPatients } from "../lib/api";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import NewPatientModal from "./NewPatientModal";
import BlurEffect from "react-progressive-blur";

// ----------------------------
// LayoutWrapper
// ----------------------------
export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [externalFile, setExternalFile] = useState(null);
  const { patientId } = useParams();
  const [patients, setPatients] = useState([]);
  const handleGlobalFileDrop = (file) => setExternalFile(file);
  const clearExternalFile = () => setExternalFile(null);
  const { user, token, logout } = useAuth();
  const [error, setError] = useState("");
  const [newPatientId, setNewPatientId] = useState(null);
  const [rightExpanded, setRightExpanded] = useState(false);
  const handleNewPatientAdded = (newPatient) => {
  setPatients((prev) => [newPatient, ...prev]); // prepend new patient
  setNewPatientId(newPatient.id);
};

  // ---------------------
  // Fetch patients securely
  // ---------------------
  useEffect(() => {
    if (!user || !token) return;
    let cancelled = false;

    const fetchPatients = async () => {
      try {
        setError("");
        const data = await getPatients(token);
        const patientsWithId = data.map((p, idx) => ({ ...p, _key: p.id || idx }));
        if (!cancelled) {
          const sorted = patientsWithId.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPatients(sorted);
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
        if (err.message === "Unauthorized") {
          logout();
        } else {
          setError("Failed to load patients.");
        }
      }
    };

    fetchPatients();
    return () => {
      cancelled = true;
    };
  }, [user, token, logout]);

  return (
    
    // <div className="relative min-h-screen text-black bg-gradient-to-r from-blue-100 via-gray-100 to-white">
    <div className="relative min-h-screen text-black bg-gray-50">
      {/* <div className="relative min-h-screen text-black bg-gradient-to-br from-gray-200 via-gray-500/40 to-gray-300"> */}
      <NewPatientModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onNewPatientAdded={handleNewPatientAdded}
            />
      <div className="relative z-10 flex h-screen">
        {/* Top gradient + blur */}
        <div className="absolute top-0 left-0 w-full h-30 pointer-events-none z-10" 
          style={{ 
            background: "linear-gradient(to bottom, rgba(249, 250, 251,1), rgba(249, 250, 251,0.5), rgba(249, 250, 251,0))"
          }}
        />
        <div className="relative">
          <BlurEffect position="top" intensity={50} className="h-20" />
        </div>
        {/* Bottom gradient + blur */}
        <div className="absolute bottom-0 left-0 w-full h-30 pointer-events-none z-10" 
          style={{ 
            background: "linear-gradient(to top, rgba(249, 250, 251,1), rgba(249, 250, 251,0.5), rgba(249, 250, 251,0))"
          }}
        />
        <div className="relative">
          <BlurEffect position="bottom" intensity={50} className="h-20" />
        </div>

        {/* Sidebar */}
        <div className={`transition-all duration-300 ${collapsed ? "w-[9%]" : "w-[20%]"} flex flex-col h-full`}>
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onNewPatientClick={() => setShowModal(true)}
            patients={patients}
            selectedPatientId={patientId}
            setPatients={setPatients}
            user={user}
            token={token}
            logout={logout}
            error={error}
            setError={setError}
            newPatientId={newPatientId}
          />
        </div>

        {/* Right panel */}
        <div className={`transition-all duration-300 ${collapsed ? "w-[91%]" : "w-[80%]"} flex flex-col h-full`}>
          <RightPanel 
            patientId={patientId} 
            externalFile={externalFile} 
            clearExternalFile={clearExternalFile} 
            showModal={showModal} 
            setShowModal={setShowModal}
            onNewPatientAdded={handleNewPatientAdded}
            rightExpanded={rightExpanded}
            setRightExpanded={setRightExpanded}
          >
            {children}
          </RightPanel>
        </div>
      </div>

      {/* Global DragDropOverlay */}
      <DragDropOverlay onFileDrop={handleGlobalFileDrop} />
    </div>
  );
}