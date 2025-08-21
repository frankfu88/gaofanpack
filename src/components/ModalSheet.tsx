// /src/components/ModalSheet.tsx
"use client";

import { FaTimes } from "react-icons/fa";
import { PropsWithChildren, useEffect } from "react";

// 簡易 class 合併
function cn(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

type Props = {
  title: string;
  onClose: () => void;
  /** 兼容舊用法，不做任何處理 */
  fullscreenOnMobile?: boolean;
};

export default function ModalSheet({
  title,
  onClose,
  children,
}: PropsWithChildren<Props>) {
  // 鎖背景滾動
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* 遮罩用 div，避免攔截影片互動；層級低於內容 */}
      <div className="absolute inset-0 bg-black/60 z-30" onClick={onClose} aria-hidden="true" />

      {/* 內容層明確 z-index 與互動 */}
      <div
        className={cn(
          "relative z-50 pointer-events-auto bg-white shadow-2xl rounded-2xl w-full max-w-lg max-h-[86vh] overflow-y-auto"
        )}
        onClick={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
      >
        <button
          onClick={onClose}
          aria-label="關閉"
          className="absolute right-3 top-3 text-gray-500 hover:text-red-500 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center pt-5 pb-2 px-4 sm:px-6">
          {title}
        </h2>

        <div className="px-4 sm:px-6 pb-5">{children}</div>
      </div>
    </div>
  );
}
