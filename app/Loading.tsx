import { X } from "react-feather";

interface LoadingProps {
    open: boolean;
}

export default function Loading({ open }: LoadingProps) {
    return (
        <div
        id="Loading"
            className={`
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"}
      `}>
            {/* modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
          bg-surface-a20 rounded-xl shadow p-6 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}>
                <button className="absolute top-2 right-2 p-1 rounded-lg text-gray-200 bg-surface-a30 hover:bg-surface-a40 hover:text-gray-300">
                    <X />
                </button>
            </div>
        </div>
    );
}
