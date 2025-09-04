'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import { ChatProvider, useChat } from "./context/ChatContext";
import { useParams } from "next/navigation";
import { AuthProvider } from "./context/AuthContext";
import "../styles/globals.css";

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <AuthProvider>
      <ChatProvider>
        <div className="relative min-h-screen text-black bg-gradient-to-br from-white via-white/80 to-gray-100">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl z-0" />
          <div className="relative z-10 flex h-screen">
            <div className={`transition-all duration-300 ${collapsed ? "w-[5%]" : "w-[18%]"}`}>
              <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                onNewPatientClick={() => setShowModal(true)}
              />
            </div>

            <div className={`transition-all duration-300 relative ${collapsed ? "w-[95%]" : "w-[82%]"} flex flex-col`}>
              <NewPatientModal isOpen={showModal} onClose={() => setShowModal(false)} />
              <div className="flex flex-col justify-between h-full">
                <div className="p-6 overflow-auto m-4 rounded-3xl shadow-lg bg-white/40 backdrop-blur-2xl" style={{ paddingBottom: "100px" }}>
                  {children}
                </div>
                <div className="flex justify-center w-full p-6 absolute bottom-0">
                  <div className="w-full max-w-4xl">
                    <AskInputWrapper />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}

function AskInputWrapper() {
  const { sendMessage } = useChat();
  const { patientId } = useParams();
  return (
    <AskInput
      onSend={(payload) => sendMessage(patientId, payload)}
      onUploadClick={() => {}}
    />
  );
}