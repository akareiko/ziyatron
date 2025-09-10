// app/components/AskInput.jsx
'use client';
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { createPortal } from "react-dom";
import { useFloating, offset, flip, shift, FloatingPortal } from "@floating-ui/react";

export default function AskInput({ onSend, onUploadClick, externalFile = null, onExternalFileHandled = () => {} }) {
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

  function TooltipButton({ tooltip, children, className = "", ...props }) {
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
  }

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !uploadedFile?.url) || isSending || isUploading) return;

    setIsSending(true); // 🚨 lock input
    // clear input/UI
    setInputValue("");
    setUploadedFile(null);
    setUploadProgress(0);

    try {
      await onSend?.({
        message: inputValue.trim(),
        file_url: uploadedFile?.url || null,
        file_name: uploadedFile?.name || null,
      });
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setIsSending(false); // unlock input
    }
  };

  const uploadFile = (file) => {
  setIsUploading(true);
  const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  setUploadedFile({ file, name: file.name, uploadTask, url: null });

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgress(progress);
    },
    (err) => {
      if (err.code === "storage/canceled") {
        console.info("User canceled upload.");
      } else {
        console.error("Upload error:", err);
      }
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

    if (uploadedFile.uploadTask?.cancel) {
      try {
        uploadedFile.uploadTask.cancel();
      } catch {}
    }

    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);

    // cancel upload task if in progress
    if (uploadedFile.uploadTask?.cancel) {
      try {
        uploadedFile.uploadTask.cancel();
      } catch (err) {
        console.warn("Upload task cancel failed:", err);
      }
    }

    // optimistically clear UI
    setUploadedFile(null);
    setUploadProgress(0);

    // delete file if already uploaded
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
        if (err.code === "storage/object-not-found") {
          // safe to ignore
          console.info("File already deleted:", uploadedFile.name);
        } else {
          // 🚨 real error, report to monitoring
          console.error("Delete failed:", err);
          // reportError(err, { file: uploadedFile.name });
        }
      }
    }
  };

  // Expand to "not bar" if multiline OR file exists
  useLayoutEffect(() => {
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
        {isBar && 
          <TooltipButton
            tooltip="Upload"
            onClick={handleUploadClick}
            className="p-2 rounded-full hover:bg-black/10 transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TooltipButton>
        }
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
          <TooltipButton
            tooltip={isSending ? "Processing..." : "Send"}
            onClick={handleSend}
            disabled={isUploading || isSending}
            className={`p-2 rounded-full transition ${
              isUploading || isSending ? "opacity-50 cursor-not-allowed" : "hover:bg-black/10"
            }`}
          >
            {isSending ? (
              // Pause icon
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="black"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="6" y="5" width="4" height="14" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="5" width="4" height="14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              // Send arrow
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="black"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </TooltipButton>
        )}
        
      </div>

      {!isBar && (
        <div className="flex flex-row justify-between mt-1 px-1">
          <TooltipButton
            tooltip="Upload"
            onClick={handleUploadClick}
            className="p-2 rounded-full hover:bg-black/10 transition"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TooltipButton>
          <TooltipButton
            tooltip="Send"
            onClick={handleSend}
            disabled={isUploading || isSending}
            className={`p-2 rounded-full transition ${
              isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-black/10"
            }`}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TooltipButton>
        </div>
      )}

    </div>
  );
}