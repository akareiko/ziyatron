'use client';
import { useState, useRef, useLayoutEffect, useRef as useReactRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export default function AskInput({ onSend, onUploadClick }) {
  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null); // { file, url, name, uploadTask }
  const [isBar, setIsBar] = useState(true);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef(null);
  const prevIsBar = useReactRef(isBar);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Drag and drop
  const handleDrop = (e) => {
    preventDefaults(e);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFile(files[0]); // first file only
  };
  const handleDragOver = preventDefaults;
  const handleDragEnter = preventDefaults;

  const handleChange = (e) => setInputValue(e.target.value);

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
      uploadedFile.uploadTask.cancel();
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

  // Dynamic textarea height
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10) || 20;
    const visibleLines = Math.ceil(el.scrollHeight / lineHeight);
    const newIsBar = inputValue.trim() === "" || visibleLines <= 1;
    if (prevIsBar.current === false && newIsBar === true) setTransitionEnabled(true);
    if (prevIsBar.current === true && newIsBar === false) setTransitionEnabled(false);
    if (prevIsBar.current !== newIsBar) {
      setIsBar(newIsBar);
      prevIsBar.current = newIsBar;
    }
  }, [inputValue]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  }, [isBar]);

  return (
    <div
      className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-sm border border-black/20 overflow-hidden"
      style={{
        borderRadius: isBar ? "9999px" : "1rem",
        padding: isBar ? "0.5rem 0.75rem" : "0.75rem",
        transition: transitionEnabled ? "border-radius 0.3s ease, padding 0.3s ease" : "none",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
    >
      <div className={`flex items-center gap-2 ${isBar ? "" : "mb-2"}`}>
        {isBar && (
          <button onClick={onUploadClick} className="p-2 hover:bg-black/10 rounded-full transition">
            <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={handleChange}
          placeholder="Type or drop a file..."
          className="flex-1 resize-none bg-transparent outline-none text-black placeholder-gray scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
          style={{ maxHeight: "150px", minHeight: isBar ? "1.5rem" : "2rem" }}
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

      {/* File preview bubble */}
      {uploadedFile && (
        <div className="flex items-center justify-between mt-2 bg-[#243c5a]/10 border border-[#243c5a]/30 rounded-lg px-3 py-2 max-w-sm sm:max-w-md md:max-w-lg shadow-sm">
          <span className="truncate overflow-hidden text-sm">📄 {uploadedFile.name}</span>
          <button
            onClick={cancelUpload}
            className="text-red-500 font-bold ml-2 hover:bg-red-100 rounded-full px-1"
            title="Cancel upload"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload progress */}
      {uploadProgress > 0 && (
        <div className="w-full bg-black/10 h-1 rounded mt-1">
          <div className="bg-blue-500 h-1 rounded" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}
    </div>
  );
}