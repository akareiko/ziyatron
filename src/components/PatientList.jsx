import { memo } from "react";
import PatientItem from "./PatientItem";

function PatientList({ patients, selectedChat, setSelectedChat, collapsed }) {
  return (
    <div className="mt-3">
      <h4
        className={`mb-1.5 p-1.5 text-gray-500 transition-all duration-200 overflow-hidden whitespace-nowrap ${
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        Patients
      </h4>
      <ul role="list" className="flex flex-col">
        {patients.map((p) => (
          <PatientItem
            key={p.id}
            patient={p}
            collapsed={collapsed}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        ))}
      </ul>
    </div>
  );
}

export default memo(PatientList);