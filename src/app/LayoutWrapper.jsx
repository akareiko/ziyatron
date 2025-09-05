// app/components/LayoutWrapper.jsx
'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import { useParams } from "next/navigation";
import { useChat } from "./context/ChatContext";

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

          {/* Content + AskInput */}
          <div className="flex flex-col h-full relative">
            <div className="rounded-3xl m-4 shadow-lg bg-white/40 backdrop-blur-2xl flex flex-col h-full p-6" style={{ height: 'calc(100% - 2rem)' }} /* 1rem = 4 spacing units */>
              {/* Scrollable content */}
              <div className="flex-1 overflow-auto pr-2">
                {children}
              </div>

              {/* AskInput fixed at bottom inside panel */}
                <AskInputWrapper />
            </div>
          </div>
        </div>
      </div>
    </div>
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