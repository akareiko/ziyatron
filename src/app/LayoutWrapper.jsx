"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import NewPatientModal from "./NewPatientModal";
import Image from "next/image";
import AskInput from "./AskInput";
import { ChatProvider, useChat } from "./context/ChatContext";
import kek from "../../public/amextwo.png";
import { useParams } from "next/navigation";
import '../styles/globals.css';

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <ChatProvider>
      <div className="relative min-h-screen text-black">
        {/* Background image with subtle overlay */}
        <Image
          src={kek}
          width={500}
          height={500}
          alt="Background"
          className="z-0 absolute top-0 left-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md z-0" />

        {/* Layout container */}
        <div className="relative z-10 flex flex-row h-screen">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${
              collapsed ? "w-[5%]" : "w-[18%]"
            }`}
          >
            <Sidebar
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              onNewPatientClick={() => setShowModal(true)}
            />
          </div>

          {/* Main content */}
          <div
            className={`transition-all duration-300 relative ${
              collapsed ? "w-[95%]" : "w-[82%]"
            } flex flex-col`}
          >
            <NewPatientModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            />

            <div className="flex flex-col justify-between h-full">
              {/* Chat content area */}
              <div className="p-6 overflow-auto m-4 bg-white/25 backdrop-blur-lg shadow-xl rounded-3xl" style={{ paddingBottom: '100px' }}>
                {children}
              </div>

              {/* Input area */}
              <div className="flex flex-row justify-center w-full p-6 absolute bottom-0 z-10">
                <AskInputWrapper />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}

function AskInputWrapper() {
  const { sendMessage } = useChat();
  const { patientId } = useParams();

  const handleSend = (msg) => {
    sendMessage(patientId, msg);
  };

  return <AskInput onSend={handleSend} />;
}