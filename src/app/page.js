'use client';
import { useState } from "react";
import Sidebar from "./Sidebar";
import AskInput from "./AskInput";
import NewPatientModal from "./NewPatientModal";

export default function Home() {
 const [collapsed, setCollapsed] = useState(false);
 const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-row">
      <div className={`transition-all ease-out duration-300 ${collapsed ? "w-[5%]" : "w-[18%]"}`}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onNewPatientClick={() => setShowModal(true)} />
      </div>
      <div className={`transition-all ease-out duration-300 ${collapsed ? "w-[95%]" : "w-[82%]"}`}>
        <NewPatientModal isOpen={showModal} onClose={() => setShowModal(false)} />
        <div className="p-4 mt-64">
          <div className="flex flex-col">
          <div className="text-3xl w-full flex justify-center">What's on the agenda today?</div>

          <div className="mt-4 w-full flex justify-center">
            <AskInput />
          </div>
          </div>
           
        </div>
      </div>
    </div>
  );
}