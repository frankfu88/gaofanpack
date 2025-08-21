// /src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import { blocks } from "@/data/blocks";
import BubbleGrid from "@/components/BubbleGrid";
import ModalSheet from "@/components/ModalSheet";

export default function HighAltitudeKit() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveIndex(null);
    if (activeIndex !== null) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex]);

  return (
    <main className="bg-gradient-to-b from-green-100 to-white min-h-screen text-gray-900">
      <section className="max-w-xl mx-auto py-8 px-4 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">什么是高原反应？</h1>
        <p className="text-base sm:text-lg leading-relaxed">
          高原反应是人体在高海拔、空气稀薄、氧气较低环境下的常见反应。
          当海拔升高、吸入氧气减少，身体会通过加快呼吸与心跳来维持运作，
          但仍可能出现头痛、胸闷、恶心、乏力等不适。
          <br /><br />
          为帮助你更好适应高原环境，我们准备了「高反急救包」，包含关键物品与应对方法，随取随用、简单可靠。
          <br /><br />
          👇 点击下方圆形图标，了解产品与使用要点。
        </p>
      </section>

      <BubbleGrid blocks={blocks} onSelect={setActiveIndex} />

      {activeIndex !== null && (
        <ModalSheet
          title={blocks[activeIndex].title}
          onClose={() => setActiveIndex(null)}
        >
          {(() => {
            const b = blocks[activeIndex];
            if (b.contentType === "video") {
              return (
                <>
                  <p className="text-base sm:text-lg text-gray-700 mb-3">{b.description}</p>
                  <VideoPlayer
                    sources={b.sources}
                    className="w-full rounded-xl shadow"
                    showQualitySelector
                    autoFullscreenOnMobile   // ✅ 手機按播放即原生全螢幕
                  />
                </>
              );
            }
            return (
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700">
                {b.textContent.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            );
          })()}
        </ModalSheet>
      )}
    </main>
  );
}
