import { useState, useEffect } from "react";

export default function NewPatientModal({ isOpen, onClose, setSelectedChat }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [visible, setVisible] = useState(isOpen);

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

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("No auth token found.");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/add-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, age, condition }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("Saved!");
        setName(""); setAge(""); setCondition("");
        setTimeout(() => {
          setStatus(""); handleClose();
        }, 1000);
      } else {
        setStatus(data.error || "Error saving patient");
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl p-6 rounded-2xl bg-white/30 backdrop-blur-xl shadow-2xl flex flex-col relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-light mb-4">New Patient</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-lg border text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-black/30"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full p-3 rounded-lg border text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-black/30"
          />
          <textarea
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            rows={4}
            required
            className="w-full p-3 rounded-lg border text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-black/30 resize-none"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-green-600">{status}</span>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-black/70 text-white hover:bg-black/90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}