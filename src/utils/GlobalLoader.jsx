import React from "react";
import { useLoading } from "./LoadingContext";

// export default function GlobalLoader() {
//   const { isFullscreen } = useLoading();
//   if (!isFullscreen) return null;

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
//       <div className="flex gap-2">
//         <span className="dot delay-0" />
//         <span className="dot delay-150" />
//         <span className="dot delay-300" />
//       </div>

//       <style>{`
//         .dot {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, rgba(79,70,229,0.7), rgba(59,130,246,0.7));
//           animation: bounce 1.4s infinite ease-in-out both;
//         }
//         .delay-0 { animation-delay: 0s; }
//         .delay-150 { animation-delay: .15s; }
//         .delay-300 { animation-delay: .3s; }

//         @keyframes bounce {
//           0%, 80%, 100% {
//             transform: scale(0);
//             opacity: .4;
//           }
//           40% {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
export default function GlobalLoader() {
  const { isFullscreen } = useLoading();
  if (!isFullscreen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="flex gap-4">
        <span className="dot delay-0" />
        <span className="dot delay-150" />
        <span className="dot delay-300" />
      </div>

      <style>{`
        .dot {
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: linear-gradient(
            135deg,
            rgba(55,48,163,1),   /* indigo-800 */
            rgba(29,78,216,1)    /* blue-700 */
          );
          animation: bounce 1.5s infinite ease-in-out both;
          box-shadow: 0 0 10px rgba(29,78,216,0.5);
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
            transform: scale(1.15);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
