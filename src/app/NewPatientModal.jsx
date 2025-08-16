import { useState, useEffect } from "react";
export default function NewPatientModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/add-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  const [visible, setVisible] = useState(isOpen);
  const [overlayOpacity, setOverlayOpacity] = useState(isOpen ? 1 : 0);
  const transitionDuration = 150; // ms

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setOverlayOpacity(1), 10);
    } else {
      setOverlayOpacity(0); 
      setTimeout(() => setVisible(false), transitionDuration); 
    }
  }, [isOpen]);

  const handleClose = () => {
    setOverlayOpacity(0);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, transitionDuration);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity"
      style={{
        background: `rgba(0,0,0,0.7)`,
        opacity: overlayOpacity,
        transition: `opacity ${transitionDuration}ms`,
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-md p-8 rounded-3xl"
        style={{
          background:
            "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1.5px solid rgba(255, 255, 255, 0.18)",
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 0 10px 1px rgba(255, 255, 255, 0.1)",
          color: "rgba(245, 245, 245, 0.9)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="modal-title"
            className="text-2xl tracking-wide"
            style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: 500 }}
          >
            New Patient
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-red-400 text-3xl leading-none transition"
            aria-label="Close modal"
            tabIndex={0}
          >
            ✖
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            className="w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[rgba(255,255,255,0.3)]
                text-inherit placeholder-[rgba(255,255,255,0.6)]
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60
                transition
                caret-white
                "
            />
            <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)] select-none">
              Enter full patient name.
            </p>
          </div>

          <div>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              inputMode="numeric"
              pattern="[0-9]*"
            className="w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[rgba(255,255,255,0.3)]
                text-white placeholder-[rgba(255,255,255,0.6)]
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60
                transition
                caret-white
                appearance-none
              "
              style={{ MozAppearance: "textfield" }}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)] select-none">
              Type age using keyboard; no arrows.
            </p>
          </div>

          <div>
            <textarea
              placeholder="Condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              rows={5}
            className="w-full rounded-xl px-4 py-3
                bg-transparent
                border border-[rgba(255,255,255,0.3)]
                text-white placeholder-[rgba(255,255,255,0.6)]
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60
                transition
                caret-white
                resize-none
              "
            />
            <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)] select-none">
              Brief description of patient's condition.
            </p>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-green-400">{status}</span>
            <button
              type="submit"
            className="rounded-xl px-6 py-3
                bg-gradient-to-r from-[rgba(255,255,255,0.15)] to-[rgba(255,255,255,0.05)]
                border border-[rgba(255,255,255,0.3)]
                text-white
                shadow-md
                hover:bg-gradient-to-r hover:from-[rgba(255,255,255,0.3)] hover:to-[rgba(255,255,255,0.1)]
                transition
                backdrop-filter backdrop-blur-md
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}