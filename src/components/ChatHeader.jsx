import { useParams } from "next/navigation";
import MoreOptionsDropdown from "./MoreOptionsDropdown";

export default function ChatHeader({ title }) {
  const { patientId } = useParams();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="flex items-center justify-between pb-2 mb-0 border-b border-gray-300">
      <button className="p-2 rounded-xl hover:bg-black/10 transition flex flex-row"
            aria-label="Share patient link">
        {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="M480-492q-76 0-129-53t-53-129q0-76 53-129t129-53q76 0 129 53t53 129q0 76-53 129t-129 53ZM130-99v-143q0-41 19.69-73.85Q169.38-348.71 202-366q66-34 135.91-51t142-17Q552-434 622-417t136 51q32.63 17.29 52.31 50.15Q830-283 830-242v143H130Z"/></svg> */}
        <h2 className="text-lg font-light text-black">{title}</h2>
      </button>
      {patientId && (
        <div className="flex items-center gap-3 text-sm">
          <button
            className="p-2 rounded-xl hover:bg-black/10 transition flex flex-row"
            aria-label="Share patient link"
            onClick={handleShare}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#000000ff">
              <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/>
            </svg>
            <p className="text-black pl-1">Share</p>
          </button>
          <MoreOptionsDropdown patient={patientId} />
        </div>
      )}
    </div>
  );
}