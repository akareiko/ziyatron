import { useRouter } from "next/navigation";

function SidebarHeader({ collapsed, setCollapsed, scrollContainerRef }) {
  const router = useRouter();

  const handleTopOrExit = () => {
    const el = scrollContainerRef?.current;
    if (el && el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/"); // go home
    }
  };

  return (
    <div className="">
      {collapsed ? (
        // Collapsed: only arrow button
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center p-2 rounded-lg text-black hover:bg-black/5 transition-colors duration-200"
          aria-label="Expand sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="black"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        // Expanded: Ziyatron + collapse arrow
        <div className="flex items-center">
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(true)}
            className="p-2 rounded-xl text-black hover:bg-black/5 transition-colors duration-200"
            aria-label="Collapse sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Ziyatron button */}
          <button
            onClick={handleTopOrExit}
            className="p-2 rounded-xl text-black hover:bg-black/5 transition-colors duration-200"
          >
            Ziyatron
          </button>
        </div>
      )}
    </div>
  );
}

export default SidebarHeader;