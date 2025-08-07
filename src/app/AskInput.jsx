import { useState } from "react";

export default function AskInput() {
  const [inputValue, setInputValue] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setInputValue(`📄 Uploaded: ${file.name}`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Ask anything or drop a file"
      className="border border-gray-300 w-[70%] rounded-full p-4 bg-gray-800 text-white"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      value={inputValue}
      onChange={handleChange}
    />
  );
}