import { useState } from "react";

export default function NewPatientModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/add-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, age, condition }),
    });

    const data = await res.json();

    if (data.success) {
      setStatus("Saved!");
      setName("");
      setAge("");
      setCondition("");
      setTimeout(() => {
        setStatus(null);
        onClose();
      }, 1000);
    } else {
      setStatus(data.error || "Error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">New Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">✖</button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          />
          <textarea
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600">{status}</span>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}