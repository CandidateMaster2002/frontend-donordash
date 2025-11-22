import React from "react";

/**
 * Reusable Loader component using Tailwind CSS
 *
 * Props:
 * - text: string - The text to show above the spinner (default devotional chant)
 * - fullscreen: boolean - when true the loader covers the whole screen with overlay (default true)
 * - size: 'sm' | 'md' | 'lg' - controls spinner/text sizing (default 'md')
 * - variant: 'ring' | 'dots' | 'pulse' - visual style of loader (default 'ring')
 * - ariaLabel: string - accessible label for screen readers (default: "Loading")
 * - className: string - extra classes to apply to the inner card
 *
 * Behavior change: text is now static (no marquee). The full text is shown (wrapped) and
 * the circular spinner is displayed below the text.
 */

export default function Loader({
  text = "Please Chant, Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare / Hare Rāma Hare Rāma Rāma Rāma Hare Hare",
  fullscreen = true,
  size = "md",
  variant = "ring",
  ariaLabel = "Loading",
  className = "",
}) {
  const sizeMap = {
    sm: {
      spinner: "w-6 h-6",
      text: "text-sm",
      gap: "gap-2",
      padding: "p-3",
    },
    md: {
      spinner: "w-10 h-10",
      text: "text-base",
      gap: "gap-3",
      padding: "p-4",
    },
    lg: {
      spinner: "w-16 h-16",
      text: "text-lg",
      gap: "gap-4",
      padding: "p-6",
    },
  }[size || "md"];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4"
          : "inline-flex items-center justify-center p-2"
      }
    >
      {/* Inner card */}
      <div
        className={`max-w-3xl w-full mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ${sizeMap.padding} flex flex-col items-center text-center ${className}`}
      >
        {/* Text area - static, wrapped */}
        <div className="w-full">
          <div
            className={`mx-auto max-w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-50 to-yellow-50 dark:from-slate-800 dark:to-slate-900 border border-transparent dark:border-slate-700 shadow-inner`}
          >
            <p
              className={`${sizeMap.text} font-medium text-gray-800 dark:text-gray-200 leading-relaxed`}
            >
              {text}
            </p>
          </div>
        </div>

        {/* Spacer between text and spinner */}
        <div className="mt-4" />

        {/* spinner / variant area placed below the text */}
        <div className={`flex items-center ${sizeMap.gap} mb-0 md:mb-0`}>
          {variant === "ring" && (
            <svg
              className={`${sizeMap.spinner} animate-spin text-red-500`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}

          {variant === "dots" && (
            <div className="flex items-end space-x-2">
              <span className={`inline-block ${sizeMap.spinner}`}>
                <span
                  className="block rounded-full animate-bounce"
                  style={{
                    width: "0.45em",
                    height: "0.45em",
                    backgroundColor: "currentColor",
                    display: "inline-block",
                    animationDelay: "0s",
                  }}
                />
              </span>
              <span className={`inline-block ${sizeMap.spinner}`}>
                <span
                  className="block rounded-full animate-bounce"
                  style={{
                    width: "0.45em",
                    height: "0.45em",
                    backgroundColor: "currentColor",
                    display: "inline-block",
                    animationDelay: "0.12s",
                  }}
                />
              </span>
              <span className={`inline-block ${sizeMap.spinner}`}>
                <span
                  className="block rounded-full animate-bounce"
                  style={{
                    width: "0.45em",
                    height: "0.45em",
                    backgroundColor: "currentColor",
                    display: "inline-block",
                    animationDelay: "0.24s",
                  }}
                />
              </span>
            </div>
          )}

          {variant === "pulse" && (
            <div
              className={`rounded-full ${sizeMap.spinner} bg-red-500 animate-pulse`}
            />
          )}
        </div>

        {/* small helper - visually hidden live text for screen readers */}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    </div>
  );
}
