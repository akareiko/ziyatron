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
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="black" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg> */}

          <svg className="w-6 h-6" viewBox="0 0 769 602" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M564.765 440C488.279 440 435.84 364.92 462.123 293.091L569.006 1V1C644.789 1 697.498 76.3487 671.514 147.538L564.765 440Z" fill="black"/>
            <path d="M97.6049 591C30.0284 591 -16.7693 523.535 6.90204 460.24L119 160.5C186.573 160.598 231.66 229.611 208.5 293.091L97.6049 591V591Z" fill="black"/>
            <path d="M162.18 524.022C150.415 556.612 174.56 591 209.209 591H506L517.8 561C427.804 561 367.108 471.175 397.052 386.306L509.489 67.6364C520.966 35.1062 496.833 1 462.337 1H176.8L165 31C256.831 31 305.912 123.674 275.439 210.301L162.18 524.022Z" fill="black"/>
            <path d="M564.765 440C488.279 440 435.84 364.92 462.123 293.091L569.006 1V1C644.789 1 697.498 76.3487 671.514 147.538L564.765 440Z" stroke="black"/>
            <path d="M97.6049 591C30.0284 591 -16.7693 523.535 6.90204 460.24L119 160.5C186.573 160.598 231.66 229.611 208.5 293.091L97.6049 591V591Z" stroke="black"/>
            <path d="M162.18 524.022C150.415 556.612 174.56 591 209.209 591H506L517.8 561C427.804 561 367.108 471.175 397.052 386.306L509.489 67.6364C520.966 35.1062 496.833 1 462.337 1H176.8L165 31C256.831 31 305.912 123.674 275.439 210.301L162.18 524.022Z" stroke="black"/>
          </svg>
          {/* <svg className="w-5 h-5" viewBox="0 0 769 602" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M505.337 1C539.833 1 563.966 35.1062 552.489 67.6364L440.052 386.306C410.108 471.175 473.069 560.155 563.066 560.155C563.519 560.155 563.834 560.574 563.678 561L549 591H252.209C217.56 591 193.415 556.612 205.18 524.022L318.439 210.301C348.912 123.674 299.831 31 208 31L219.8 1H505.337Z" fill="black"/>
            <path d="M607.765 440C531.279 440 478.84 364.92 505.123 293.091L612.006 1H768L607.765 440Z" fill="black"/>
            <path d="M1 601L162 160.5C229.573 160.598 276.522 228.297 253.362 291.778L140.605 600.845L1 601Z" fill="black"/>
            <path d="M505.337 1C539.833 1 563.966 35.1062 552.489 67.6364L440.052 386.306C410.108 471.175 473.069 560.155 563.066 560.155C563.519 560.155 563.834 560.574 563.678 561L549 591H252.209C217.56 591 193.415 556.612 205.18 524.022L318.439 210.301C348.912 123.674 299.831 31 208 31L219.8 1H505.337Z" stroke="black"/>
            <path d="M607.765 440C531.279 440 478.84 364.92 505.123 293.091L612.006 1H768L607.765 440Z" stroke="black"/>
            <path d="M1 601L162 160.5C229.573 160.598 276.522 228.297 253.362 291.778L140.605 600.845L1 601Z" stroke="black"/>
          </svg> */}
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