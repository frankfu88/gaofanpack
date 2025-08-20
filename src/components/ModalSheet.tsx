// /src/components/ModalSheet.tsx
'use client';

import { FaTimes } from "react-icons/fa";
import { PropsWithChildren, useEffect } from "react";

export default function ModalSheet({
  title,
  onClose,
  children,
}: PropsWithChildren<{ title: string; onClose: () => void }>) {
  // 開啟時鎖住背景滾動（避免手機背景跟著滑）
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4 sm:p-6
      "
      role="dialog"
      aria-modal="true"
    >
      {/* 背景遮罩（點擊關閉） */}
      <button
        aria-label="關閉"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* 內容卡片：手機置中 */}
      <div
        className="
          relative w-full max-w-lg
          bg-white rounded-2xl shadow-2xl
          p-4 sm:p-6
          max-h-[92vh] sm:max-h-[86vh]
          overflow-y-auto
        "
        style={{
          // iOS 安全區，避免頂/底貼邊
          paddingTop: "max(env(safe-area-inset-top), 1rem)",
          paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
        }}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
          aria-label="關閉"
        >
          <FaTimes size={22} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
