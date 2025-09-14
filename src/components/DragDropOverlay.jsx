// app/components/DragDropOverlay.jsx
'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * DragDropOverlay
 * - Shows a full-page overlay while a file is being dragged over the window.
 * - Calls onFileDrop(file) when user drops a file anywhere.
 *
 * Props:
 * - onFileDrop: function(File) -> void
 * - enabled: boolean (optional) - allow overlay; default true
 */
export default function DragDropOverlay({ onFileDrop, enabled = true }) {
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const prevent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      prevent(e);
      // Some browsers fire dragenter for child nodes; use counter to avoid flicker
      dragCounter.current += 1;
      // Only show overlay if files are present (not text/uri)
      const hasFiles = Array.from(e.dataTransfer?.types || []).includes('Files');
      if (hasFiles) setDragging(true);
    };

    const handleDragOver = (e) => {
      prevent(e);
      // keep event alive to allow drop
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (e) => {
      prevent(e);
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setDragging(false);
      }
    };

    const handleDrop = (e) => {
      prevent(e);
      dragCounter.current = 0;
      setDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];

        // Only allow .edf files
        if (file.name.toLowerCase().endsWith('.edf')) {
          onFileDrop?.(file);
        } else {
          alert('Only .EDF files are supported!');
        }
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [enabled, onFileDrop]);

  if (!dragging) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
    >
      {/* translucent backdrop */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* centered drop card */}
      <div
        className="relative z-10 w-[min(720px,92%)] max-w-3xl p-8 flex flex-col items-center gap-4"
        aria-hidden="false"
      >
        {/* Placeholder image: replace with your own asset if desired */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
        >
          <path d="M12 3v10" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 6l3-3 3 3" stroke="black" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="13" width="18" height="7" rx="2" stroke="black" strokeWidth="1.2" />
        </svg>

        <h3 className="text-lg font-semibold text-gray-900">Drop your file anywhere</h3>
        <p className="text-sm text-gray-600 text-center">We detected a file — drop it here to upload. You can drop anywhere on the page.</p>

        <div className="mt-2 text-xs text-gray-500">
          <span className="inline-block px-3 py-1 bg-gray-100 rounded-full border border-gray-200">Supports: .EDF files</span>
        </div>
      </div>
    </div>
  );
}