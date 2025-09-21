import { useState, useEffect, useRef } from "react";
import { addPatient } from "../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function NewPatientModal({ isOpen, onClose, onNewPatientAdded }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [visible, setVisible] = useState(isOpen);
  const modalRef = useRef(null);
  const router = useRouter();
  const { token } = useAuth();

  // Open/close modal based on isOpen prop
  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  // Close on outside click
  useEffect(() => {
    if (!visible) return;
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus("No auth token found.");
      return;
    }

    try {
      const res = await addPatient({ name, age, condition }, token);

      if (res?.success && res?.patient) {
        const newPatient = {
          id: res.patient.id,
          name: res.patient.name,
          age: res.patient.age,
          condition: res.patient.condition,
        };

        onNewPatientAdded?.(newPatient);
        setStatus("Patient added successfully!");
        setName(""); setAge(""); setCondition("");
        onClose?.();
        router.push(`/chat/${newPatient.id}`);
      } else {
        setStatus("Failed to create patient.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error adding patient. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Click-outside wrapper */}
      <div 
        ref={modalRef}
        className="w-full max-w-lg p-4 border border-gray-300 rounded-3xl bg-white/30 backdrop-blur-xl shadow-2xl flex flex-col relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-light">Add new patient</h2>
        <h3 className="text-sm font-light mb-3">Please fill in the details below:</h3>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-sm font-bold">Patient Name</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-lg border border-gray-300 text-black placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold">Patient Age</h2>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full p-2 text-sm rounded-lg border border-gray-300 text-black placeholder-gray-300 focus:outline-none"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold">Medical Condition</h2>
            <textarea
              placeholder="Condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              rows={4}
              required
              className="w-full p-2 text-sm rounded-lg border border-gray-300 text-black placeholder-gray-300 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-green-600">{status}</span>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-black text-white hover:bg-black/90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}