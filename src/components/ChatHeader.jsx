import MoreOptionsDropdown from "./MoreOptionsDropdown";
import { useParams } from "next/navigation";

export default function ChatHeader({ title }) {
  const { patientId } = useParams();
  return (
    <div className="flex items-center justify-between pb-4 mb-0 border-b border-gray-300">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {patientId && (
          <div className="flex items-center gap-3">
            {/* Share button */}
            <button
              className="p-2 rounded-xl hover:bg-black/10 transition flex flex-row"
              aria-label="Share"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff">
                <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/>
              </svg>
              <p className="text-black pl-1">Share</p>
            </button>
            {/* More options */}
            <MoreOptionsDropdown patient={patientId} />
          </div>
        )}
      </div>
    );
}