'use client';
import { useState, useRef, useLayoutEffect, useEffect, memo } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../lib/firebase";
import { useFloating, offset, flip, shift, FloatingPortal } from "@floating-ui/react";
import { useChat } from "../context/ChatContext";

// -------------------------
// Tooltip button (moved outside and memoized)
// -------------------------
const TooltipButton = memo(function TooltipButton({ tooltip, children, className = "", ...props }) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    middleware: [offset(8), flip(), shift()],
  });

  return (
    <>
      <button
        ref={refs.setReference}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={className}
        {...props}
      >
        {children}
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="px-2 py-1 rounded text-xs text-white bg-black/80 shadow whitespace-nowrap z-[9999]"
          >
            {tooltip}
          </div>
        </FloatingPortal>
      )}
    </>
  );
});

export default function AskInput({ onSend, externalFile = null, onExternalFileHandled = () => {} }) {
  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null); 
  const [isBar, setIsBar] = useState(true);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef(null);
  const prevIsBar = useRef(isBar);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { isStreaming, setIsStreaming } = useChat();

  // -------------------------
  // File handling
  // -------------------------
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".edf")) {
      alert("Only .edf files are allowed.");
      e.target.value = "";
      return;
    }

    uploadFile(file);
    e.target.value = "";
  };

  const uploadFile = (file) => {
    setIsUploading(true);
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadedFile({ file, name: file.name, uploadTask, url: null });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (err) => {
        console.error("Upload failed:", err);
        setUploadedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const gsPath = `gs://${storageRef.bucket}/${storageRef.fullPath}`;
        setUploadedFile((prev) => ({ ...prev, url: gsPath }));
        setUploadProgress(0);
        setIsUploading(false);
      }
    );
  };

  const cancelUpload = async () => {
    if (!uploadedFile) return;

    // cancel Firebase upload
    try { uploadedFile.uploadTask?.cancel?.(); } catch (err) { console.warn(err); }

    // delete uploaded file if exists
    if (uploadedFile.url) {
      try {
        const path = uploadedFile.url.startsWith("gs://")
          ? uploadedFile.url.replace(`gs://${storageRef.bucket}/`, "")
          : decodeURIComponent(uploadedFile.url.split("/o/")[1].split("?")[0]);
        await deleteObject(ref(storage, path));
      } catch (err) {
        if (err.code !== "storage/object-not-found") console.error("Delete failed:", err);
      }
    }

    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // -------------------------
  // Send message
  // -------------------------
  const handleSend = async () => {
    if ((!inputValue.trim() && !uploadedFile?.url) || isSending || isUploading) return;

    setIsSending(true);
    setIsStreaming(true);
    const payload = {
      message: inputValue.trim(),
      file_url: uploadedFile?.url || null,
      file_name: uploadedFile?.name || null,
    };

    setInputValue("");
    setUploadedFile(null);
    setUploadProgress(0);

    try {
      await onSend?.(payload);
    } catch (err) {
      console.error("Send failed:", err);
      setIsStreaming(false);
    } finally {
      setIsSending(false);
    }
  };

  // -------------------------
  // Auto-expand & isBar logic
  // -------------------------
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Auto-expand height
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";

    // Detect line wrapping (i.e. when text exceeds width)
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight, 10) || 20;
    const visibleLines = Math.ceil(el.scrollHeight / lineHeight);

    // --- New rules ---
    if (!isBar) {
      // Stay expanded until fully cleared
      if (inputValue.trim() === "" && !uploadedFile) {
        setIsBar(true);
      }
      return;
    }

    // If compact, expand only when wrapping starts or file exists
    if (visibleLines > 1 || uploadedFile) {
      setIsBar(false);
    }
  }, [inputValue, uploadedFile, isBar]);

  // -------------------------
  // Handle external file
  // -------------------------
  useEffect(() => {
    if (!externalFile) return;
    uploadFile(externalFile);
    onExternalFileHandled?.();
  }, [externalFile, onExternalFileHandled]);

  return (
    <div
      className="w-full max-w-3xl bg-white/80 backdrop-blur-xs border shadow-lg border-white/90 overflow-hidden"
      style={{
        borderRadius: isBar ? "9999px" : "1.5rem",
        padding: isBar ? "0.5rem 0.75rem" : "0.75rem",
        transition: transitionEnabled ? "border-radius linear, padding 0.2s ease" : "none",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".edf"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadedFile && (
        <div className="mb-2 flex items-start">
          <div className="relative w-24 h-24 bg-[#243c5a]/10 border border-[#243c5a]/30 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-xs text-center px-1 truncate">📄 {uploadedFile.name}</span>
            {uploadProgress > 0 && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
                <path className="text-gray-300" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32" />
                <path className="text-blue-600" stroke="currentColor" strokeWidth="3" fill="none"
                  strokeDasharray="100, 100" strokeDashoffset={100 - uploadProgress} strokeLinecap="round"
                  d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
                />
              </svg>
            )}
            <button
              onClick={cancelUpload}
              className="absolute top-1 right-1 text-red-500 font-bold hover:bg-red-100 rounded-full px-1"
              title="Cancel upload"
            >✕</button>
          </div>
        </div>
      )}

      <div className={`flex  gap-2 ${isBar ? "items-center" : " flex-col"}`}>
        {isBar && (
          <TooltipButton tooltip="Upload" onClick={handleUploadClick} className="p-2 rounded-full hover:bg-gray-200/80 transition">
            <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TooltipButton>
        )}
        <textarea
          ref={textareaRef}
          value={inputValue}
          placeholder="Type or drop a file..."
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          onChange={(e) => setInputValue(e.target.value)}
          className={`resize-none bg-transparent outline-none text-black placeholder-gray scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent ${isBar ? "flex-1" : "w-full"}`}
          style={{ maxHeight: "150px", minHeight: "1.5rem"}}
          rows={1}
        />
        {isBar && (
          <TooltipButton
            tooltip={isSending ? "Processing..." : "Send"}
            onClick={handleSend}
            disabled={isUploading || isSending || isStreaming}
            className={`p-2 rounded-full transition ${isUploading || isSending || isStreaming ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200/80"}`}
          >
            {isStreaming ? (
              <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="5" width="4" height="14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </TooltipButton>
        )}
        {!isBar && (
          <div className="flex flex-row justify-between w-full">
            <TooltipButton tooltip="Upload" onClick={handleUploadClick} className="p-2 rounded-full hover:bg-black/10 transition">
              <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </TooltipButton>
            <TooltipButton
              tooltip={isSending ? "Processing..." : "Send"}
              onClick={handleSend}
              disabled={isUploading || isSending || isStreaming}
              className={`p-2 rounded-full transition ${isUploading || isSending || isStreaming ? "opacity-50 cursor-not-allowed" : "hover:bg-black/10"}`}
            >
              {isStreaming ? (
                <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="6" y="5" width="4" height="14" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="14" y="5" width="4" height="14" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </TooltipButton>
          </div>
        )}
      </div>
    </div>
  );
}