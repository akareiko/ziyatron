import { memo } from "react";
import clsx from "clsx";

function SidebarItem ({ icon, label, collapsed, onClick, selected }) {
    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
            role="button"
            tabIndex={0}
            className={clsx(
            "flex items-center p-1.5 rounded-xl text-black cursor-pointer transition-colors duration-200 hover:bg-black/10 w-full",
            selected && "bg-white/40 shadow"
            )}
        >
            <span className="w-5 h-5 flex justify-center items-center flex-shrink-0">{icon}</span>
            <span
            className={clsx(
                "whitespace-nowrap overflow-hidden transition-all duration-200",
                collapsed ? "w-0 opacity-0 pointer-events-none ml-0" : "opacity-100 ml-2"
            )}
            >
            {label}
            </span>
        </div>
    );
}

export default memo(SidebarItem);
