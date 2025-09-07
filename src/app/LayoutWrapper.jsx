// app/components/LayoutWrapper.jsx
'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import NewPatientModal from "./NewPatientModal";
import AskInput from "./AskInput";
import DragDropOverlay from "./DragDropOverlay";
import { useParams } from "next/navigation";
import { useChat } from "./context/ChatContext";

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // file dropped somewhere on page -> pass to AskInput via externalFile
  const [externalFile, setExternalFile] = useState(null);

  function ChatHeader({ title }) {
    return (
      <div className="flex items-center justify-between pb-4 mb-0 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-black/10 transition" aria-label="Search in chat">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/></svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-black/10 transition" aria-label="More options">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
          </button>
        </div>
      </div>
    );
  }

  const handleGlobalFileDrop = (file) => {
    // You can inspect file.type / size here and reject if needed.
    // We forward it to AskInput via externalFile state so the upload flow is centralized.
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

          {/* Content + AskInput */}
          <div className="relative rounded-3xl m-4 shadow-lg bg-white/40 backdrop-blur-2xl flex flex-col h-full pt-4 pr-6 pl-6 pb-12" style={{ height: 'calc(100% - 2rem)' }}>
            <ChatHeader title="Ziyatron" />

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto flex flex-col items-center">
              <div className="w-full max-w-3xl px-4">
                {children}  {/* ChatPage */}
              </div>
            </div>

            {/* AskInput fixed at bottom */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <div className="w-full max-w-3xl px-4">
                <AskInputWrapper externalFile={externalFile} clearExternalFile={() => setExternalFile(null)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global DragDropOverlay - sits at document root */}
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
      onExternalFileHandled={() => {
        // AskInput notifies when it consumed the file; clear it here
        clearExternalFile();
      }}
    />
  );
}