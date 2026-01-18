// InlineLoader.jsx
import React from "react";
import { useLoading } from "./LoadingContext";

export default function InlineLoader({ scope = "default", children }) {
  const { inlineMap } = useLoading();
  const active = !!inlineMap[scope];

  return (
    <div className="relative">
      {children}

      {active && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex gap-3">
            <span className="dot delay-0" />
            <span className="dot delay-150" />
            <span className="dot delay-300" />
          </div>
        </div>
      )}

      <style>{`
        .dot {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: linear-gradient(
            135deg,
            rgba(55,48,163,1),   /* indigo-800 */
            rgba(29,78,216,1)    /* blue-700 */
          );
          animation: bounce 1.5s infinite ease-in-out both;
          box-shadow: 0 0 6px rgba(29,78,216,0.45);
        }

        .delay-0 { animation-delay: 0s; }
        .delay-150 { animation-delay: .15s; }
        .delay-300 { animation-delay: .3s; }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.35);
            opacity: 0.6;
          }
          40% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
