import { useParams } from "next/navigation";
import MoreOptionsDropdown from "./MoreOptionsDropdown";

export default function ChatHeader({ patientName, rightExpanded, setRightExpanded }) {
  const { patientId } = useParams();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ patientName, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="flex items-center justify-between pb-2">
      <span className="flex flex-row items-center">
        <button className="py-2 px-4 rounded-3xl hover:bg-gray-200/80 bg-white/80 shadow-lg border border-white/90 transition flex flex-row"
              aria-label="Share patient link">
          <h2 className="font-light text-black">{patientName}</h2>
        </button>
      </span>
      {patientId && (
        <div className="flex items-center gap-3 text-sm">
          <button
            className="py-2 px-4 rounded-3xl hover:bg-gray-200/80 bg-white/80 border border-white/90 shadow-lg transition flex flex-row"
            aria-label="Share patient link"
            onClick={handleShare}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#000000ff">
              <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/>
            </svg>
            <p className="text-black pl-1">Share</p>
          </button>
          <MoreOptionsDropdown patient={patientId} />
          <button
            onClick={() => setRightExpanded(!rightExpanded)}
            className="p-2 rounded-3xl hover:bg-gray-200/80 bg-white/80 border border-white/90 shadow-lg transition"
            aria-label={rightExpanded ? "Collapse patient info" : "Expand patient info"}
          >
            {rightExpanded ? (
              // collapse icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M400-240 640-480 400-720l-56 56 184 184-184 184 56 56Z"/>
              </svg>
            ) : (
              // expand icon
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}