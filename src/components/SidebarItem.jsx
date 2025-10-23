import { memo } from "react";
import clsx from "clsx";

function SidebarItem ({ icon, label, collapsed, onClick, selected }) {
    return (
        <div>
            <button
                onClick={onClick}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
                role="button"
                tabIndex={0}
                className={clsx(
                "flex items-center p-2 rounded-xl text-black cursor-pointer transition-colors duration-200 hover:bg-black/5 w-full"
                )}
            >
                <span className="w-5 h-5 flex justify-center items-center flex-shrink-0">{icon}</span>
                <span
                className={clsx(
                    "whitespace-nowrap overflow-hidden transition-all duration-200 ml-2",
                    collapsed ? "w-0 opacity-0 overflow-hidden pointer-events-none" : "opacity-100 w-auto"
                )}
                >
                    {label}
                </span>
            </button>
        </div>
    );
}

export default memo(SidebarItem);
