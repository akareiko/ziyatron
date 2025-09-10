// ---------------------
// SidebarHeader (scroll-to-top & collapse)
// ---------------------
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

function SidebarHeader({ collapsed, setCollapsed, scrollContainerRef }) {
  const router = useRouter();

  // Handle top button
  const handleTopOrExit = () => {
    const el = scrollContainerRef?.current;
    if (el && el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/"); // go home
    }
  };

  return (
    <div
      className={`mb-2 transition-colors duration-300`}
    >
      <div className="flex flex-col gap-2">
        {/* Top/Exit button */}
        <button
          onClick={handleTopOrExit}
          className="flex items-center p-1.5 rounded-lg text-black hover:bg-black/10 transition-colors duration-200"
          aria-label="Scroll to top or exit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center p-1.5 rounded-lg text-black hover:bg-black/10 cursor-pointer transition-colors duration-200"
          aria-label="Toggle sidebar"
          aria-pressed={collapsed}
        >
          <span className="w-5 h-5 flex justify-center items-center flex-shrink-0 text-gray-600">
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </span>
          {!collapsed && <span className="ml-2">Collapse</span>}
        </button>
      </div>
    </div>
  );
}

export default SidebarHeader;