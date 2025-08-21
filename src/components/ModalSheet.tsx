// /src/components/ModalSheet.tsx
'use client';

import { FaTimes } from "react-icons/fa";
import { PropsWithChildren, useEffect, useRef } from "react";

export default function ModalSheet({
  title,
  onClose,
  children,
}: PropsWithChildren<{ title: string; onClose: () => void }>) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // 開啟：鎖住背景滾動、記錄並移動焦點；關閉：恢復並還原焦點
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const prevBodyOv = document.body.style.overflow;
    const prevHtmlOv = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Esc 關閉 & Tab 焦點陷阱
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!panelRef.current.contains(document.activeElement)) {
          first.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        } else if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // 初始聚焦到面板
    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevBodyOv;
      document.documentElement.style.overflow = prevHtmlOv;
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-4 sm:p-6
        overscroll-contain
      "
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* 背景遮罩（點擊關閉） */}
      <button
        aria-label="關閉"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* 內容卡片：手機置中 */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="
          relative w-full
          max-w-[92vw] sm:max-w-lg
          bg-white rounded-2xl shadow-2xl
          p-4 sm:p-6
          overflow-y-auto
          focus:outline-none
        "
        style={{
          // 用 dvh 適配行動端鍵盤 / 瀏覽器 UI 高度波動，並提供 vh 後援
          maxHeight: "min(86dvh, 92vh)",
          paddingTop: "max(env(safe-area-inset-top), 1rem)",
          paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
          // 避免 iOS 橡皮筋把背景帶動
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          onClick={onClose}
          aria-label="關閉"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 text-center">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
