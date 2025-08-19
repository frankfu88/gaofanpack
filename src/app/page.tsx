"use client";
import React, { useEffect, useState } from "react";
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
      {/* ✅ 還原原本文案 */}
      <section className="max-w-xl mx-auto py-8 px-4 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-4">
          高原反应为何？
        </h1>
        <p className="text-base sm:text-lg leading-relaxed">
          高原反应是人体在高海拔、空气稀薄、氧气含量较低的环境下出现的一种自然反应。
          当海拔升高，吸入的氧气减少，身体为了维持正常运作会加快呼吸、加快心跳，
          但仍可能出现头痛、胸闷、恶心、全身乏力等不适感。
          <br /><br />
          为了帮助大家在高原环境下更好地适应，我们准备了简单易用的高反急救包，里面包含必需用品和应对方法，方便随时取用。
          <br /><br />
          请点击下方圆形图标，了解产品更多资讯。
        </p>
      </section>

      <BubbleGrid blocks={blocks} onSelect={setActiveIndex} />

      {activeIndex !== null && (
        <ModalSheet title={blocks[activeIndex].title} onClose={() => setActiveIndex(null)}>
          {blocks[activeIndex].contentType === "video" ? (
            <div className="space-y-3">
              <p className="text-base sm:text-lg text-gray-700">
                {blocks[activeIndex].description}
              </p>
              <div className="w-full">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-[70vh] sm:max-h-[60vh] rounded-lg border border-gray-200 shadow object-contain"
                >
                  <source src={blocks[activeIndex].videoSrc} type="video/mp4" />
                </video>
              </div>
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700">
              {blocks[activeIndex].textContent!.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
        </ModalSheet>
      )}
    </main>
  );
}