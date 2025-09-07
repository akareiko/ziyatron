// app/components/AskInput.jsx
'use client';
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { createPortal } from "react-dom";

export default function AskInput({ onSend, onUploadClick, externalFile = null, onExternalFileHandled = () => {} }) {
  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null); 
  const [isBar, setIsBar] = useState(true);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef(null);
  const prevIsBar = useRef(isBar);
  const fileInputRef = useRef(null);

  // --- UploadButton same as before ---
  function UploadButton() {
    const [hover, setHover] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    useLayoutEffect(() => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPos({ top: rect.bottom, left: rect.left + rect.width / 2 });
      }
    }, [hover]);

    const button = (
      <button
        type="button"
        ref={buttonRef}
        onClick={handleUploadClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Upload file"
        className="p-2 rounded-full hover:bg-black/10 transition"
      >
        <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );

    const tooltip = hover && createPortal(
      <div
        className="absolute px-2 py-1 rounded text-xs text-white bg-black/80 whitespace-nowrap shadow"
        style={{
          top: `${pos.top + 8}px`, // 8px below
          left: `${pos.left}px`,
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 9999,
        }}
      >
        Upload
      </div>,
      document.body
    );

    return (<>{button}{tooltip}</>);
  }

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleSend = () => {
    if (!inputValue.trim() && !uploadedFile?.url) return;
    onSend?.({
      message: inputValue.trim(),
      file_url: uploadedFile?.url || null,
      file_name: uploadedFile?.name || null,
    });
    setInputValue("");
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const uploadFile = (file) => {
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploadedFile({ file, name: file.name, uploadTask, url: null });
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        setUploadedFile(null);
        setUploadProgress(0);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const gsPath = `gs://${storageRef.bucket}/${storageRef.fullPath}`;
        setUploadedFile((prev) => ({ ...prev, url: gsPath }));
        setUploadProgress(0);
      }
    );
  };

  const cancelUpload = async () => {
    if (!uploadedFile) return;
    if (uploadedFile.uploadTask?.cancel) {
      try { uploadedFile.uploadTask.cancel(); } catch {}
    }
    if (uploadedFile.url) {
      try {
        let path;
        if (uploadedFile.url.startsWith("gs://")) {
          const parts = uploadedFile.url.replace("gs://", "").split("/");
          path = parts.slice(1).join("/");
        } else {
          path = decodeURIComponent(uploadedFile.url.split("/o/")[1].split("?")[0]);
        }
        await deleteObject(ref(storage, path));
      } catch (err) {
        console.error("Failed to delete uploaded file:", err);
      }
    }
    setUploadedFile(null);
    setUploadProgress(0);
  };

  // Expand to "not bar" if multiline OR file exists
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";

    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10) || 20;
    const visibleLines = Math.ceil(el.scrollHeight / lineHeight);
    const newIsBar = (inputValue.trim() === "" && !uploadedFile) || (visibleLines <= 1 && !uploadedFile);

    if (prevIsBar.current === false && newIsBar === true) setTransitionEnabled(true);
    if (prevIsBar.current === true && newIsBar === false) setTransitionEnabled(false);
    if (prevIsBar.current !== newIsBar) {
      setIsBar(newIsBar);
      prevIsBar.current = newIsBar;
    }
  }, [inputValue, uploadedFile]);

  // handle external file
  useEffect(() => {
    if (!externalFile) return;
    (async () => {
      try {
        uploadFile(externalFile);
      } finally {
        onExternalFileHandled?.();
      }
    })();
  }, [externalFile]);

  return (
    <div
      className="w-full max-w-3xl mx-auto bg-white backdrop-blur-lg border border-black/20 overflow-hidden"
      style={{
        borderRadius: isBar ? "9999px" : "1rem",
        padding: isBar ? "0.5rem 0.75rem" : "0.75rem",
        transition: transitionEnabled ? "border-radius 0.3s ease, padding 0.3s ease" : "none",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadedFile && (
      <div className="mb-2 flex items-start">
        <div className="relative w-24 h-24 bg-[#243c5a]/10 border border-[#243c5a]/30 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-xs text-center px-1 truncate">📄 {uploadedFile.name}</span>

          {uploadProgress > 0 && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-300"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
              />
              <path
                className="text-blue-600"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray="100, 100"
                strokeDashoffset={100 - uploadProgress}
                strokeLinecap="round"
                d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
              />
            </svg>
          )}

          <button
            onClick={cancelUpload}
            className="absolute top-1 right-1 text-red-500 font-bold hover:bg-red-100 rounded-full px-1"
            title="Cancel upload"
          >
            ✕
          </button>
        </div>
      </div>
    )}

      <div className={`flex items-center gap-2 ${isBar ? "" : "mb-2"}`}>
        {isBar && <UploadButton onClick={handleUploadClick} />}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type or drop a file..."
          className="flex-1 resize-none bg-transparent outline-none text-black placeholder-gray scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
          style={{ maxHeight: "150px", minHeight: "1.5rem"}}
          rows={1}
        />
        {isBar && (
          <button onClick={handleSend} className="p-2 hover:bg-black/10 rounded-full transition">
            <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        
      </div>

      {!isBar && (
        <div className="flex flex-row justify-between mt-1 px-1">
          <button
            onClick={onUploadClick}
            className="p-2 hover:bg-black/10 rounded-full transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16M4 12h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleSend}
            className="p-2 hover:bg-black/10 rounded-full transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}