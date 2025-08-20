"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import NewPatientModal from "./NewPatientModal";
import Image from "next/image";
import AskInput from "./AskInput";
import { ChatProvider, useChat } from "./context/ChatContext";
import kek from "../../public/Rectangle.png";
import { useParams } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <ChatProvider>
      <div>
        <Image
          src={kek}
          width={500}
          height={500}
          alt="Picture of the author"
          className="z-0 absolute top-0 left-0 w-full h-full object-cover opacity-10"
        />

        <div className="flex flex-row bg-white/2 h-screen">
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

          <div
            className={`transition-all duration-300 ${
              collapsed ? "w-[95%]" : "w-[82%]"
            }`}
          >
            <NewPatientModal isOpen={showModal} onClose={() => setShowModal(false)} />

            <div className="flex flex-col justify-between h-full">
              <div className="p-4 overflow-auto">{children}</div>

              <div className="flex flex-row justify-center p-10">
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