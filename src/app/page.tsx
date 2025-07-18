"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

// 五個區塊資料
const blocks = [
  {
    title: "開箱說明",
    contentType: "video",
    videoSrc: "/videos/unbox.mp4",
    description: "高反急救包有哪些物品？請觀看此影片。"
  },
  {
    title: "使用說明",
    contentType: "video",
    videoSrc: "/videos/howto.mp4",
    description: "如何正確使用高反急救包？請觀看此影片。"
  },
  {
    title: "注意事項",
    contentType: "text",
    textContent: [
      "高海拔地區若出現頭痛、噁心、心悸，請立即休息並使用急救包。",
      "出現全身無力或意識模糊時，務必儘速就醫。",
      "請避免劇烈活動，確保補充足夠水分。"
    ]
  },
  {
    title: "產品說明",
    contentType: "text",
    textContent: [
      "高反急救包是一套針對高海拔症狀設計的隨身應急用品。",
      "內含氧氣袋、緊急藥物、簡易手冊，適合旅遊、登山及戶外活動攜帶。"
    ]
  },
  {
    title: "服務單位",
    contentType: "text",
    textContent: [
      "單位名稱：高原健康科技有限公司",
      "聯絡人：王先生",
      "電話：02-1234-5678",
      "Email：service@example.com"
    ]
  }
];

export default function HighAltitudeKit() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <main className="bg-gradient-to-b from-green-100 to-white min-h-screen text-gray-900">
      {/* ✨ 首頁介紹 */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">
          高原反應 & 高反急救包
        </h1>
        <p className="text-xl leading-relaxed">
          高原反應是人體對於高海拔低氧環境的自然反應，
          可能出現頭痛、噁心、全身無力等症狀。<br />
          為了應對這些狀況，我們準備了簡單易用的
          <span className="font-bold text-green-800">高反急救包</span>，
          請點擊下方圓形圖示了解更多。
        </p>
      </section>

      {/* 🌿 五個圓形 block */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-6">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-green-500 text-white text-xl font-bold shadow-lg hover:bg-green-600 cursor-pointer transition"
            >
              <span>{block.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔔 Modal 彈跳視窗 */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl p-6 relative">
            {/* 關閉按鈕 */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setActiveIndex(null)}
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
              {blocks[activeIndex].title}
            </h2>

            {/* 顯示內容 */}
            {blocks[activeIndex].contentType === "video" ? (
              <div>
                <p className="mb-4 text-lg text-gray-700">
                  {blocks[activeIndex].description}
                </p>
                <video
                  controls
                  className="w-full rounded-lg shadow-md border border-gray-300"
                >
                  <source
                    src={blocks[activeIndex].videoSrc}
                    type="video/mp4"
                  />
                  您的瀏覽器不支援影片播放
                </video>
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {blocks[activeIndex].textContent?.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}