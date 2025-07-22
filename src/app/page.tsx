"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

// 五个区块资料
const blocks = [
  {
    title: "开箱说明",
    contentType: "video",
    videoSrc: "/videos/unbox.mp4",
    description: "高反急救包里有哪些物品？请观看此影片。"
  },
  {
    title: "使用说明",
    contentType: "video",
    videoSrc: "/videos/howto.mp4",
    description: "如何正确使用高反急救包？请观看此影片。"
  },
  {
    title: "注意事项",
    contentType: "text",
    textContent: [
      "高海拔地区若出现头痛、恶心、心悸，请立即休息并使用急救包。",
      "出现全身无力或意识模糊时，务必尽快就医。",
      "请避免剧烈活动，确保补充足够水分。"
    ]
  },
  {
    title: "产品说明",
    contentType: "text",
    textContent: [
      "高反急救包是一套针对高海拔症状设计的随身应急用品。",
      "内含氧气袋、紧急药物、简易手册，适合旅游、登山及户外活动携带。"
    ]
  },
  {
    title: "服务单位",
    contentType: "text",
    textContent: [
      "单位名称：高原健康科技有限公司",
      "联系人：王先生",
      "电话：02-1234-5678",
      "Email：service@example.com"
    ]
  }
];

export default function HighAltitudeKit() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <main className="bg-gradient-to-b from-green-100 to-white min-h-screen text-gray-900">
      {/* ✨ 首页介绍 */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">
          高原反应为何？
        </h1>
        <p className="text-xl leading-relaxed">
          高原反应是人体在高海拔、空气稀薄、氧气含量较低的环境下出现的一种自然反应。
          当海拔升高，吸入的氧气减少，身体为了维持正常运作会加快呼吸、加快心跳，
          但仍可能出现头痛、胸闷、恶心、全身乏力等不适感。
          <br /><br />
          为了帮助大家在高原环境下更好地适应，我们准备了简单易用的高反急救包里面包含必需用品和应对方法，方便随时取用。
          <br /><br />
          请点击下方圆形图标，了解具体的使用说明和注意事项。
        </p>
      </section>

      {/* 🌿 五个圆形 block */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-8">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="
                relative
                flex flex-col items-center justify-center
                w-40 h-40
                rounded-full
                cursor-pointer
                transition-transform transform hover:scale-110
                ring-1 ring-white/40
                backdrop-blur-sm
                bg-gradient-to-br from-white/40 via-green-100/15 to-transparent
                shadow-[0_0_20px_rgba(0,0,0,0.05)]
              "
              style={{
                boxShadow:
                  'inset -6px -6px 12px rgba(255,255,255,0.6), inset 6px 6px 12px rgba(0,0,0,0.05), 0 0 15px rgba(0,255,128,0.15)'
              }}
            >
              <span className="text-green-900 font-bold text-lg text-center drop-shadow-sm">
                {block.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔔 弹窗 Modal */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl p-6 relative">
            {/* 关闭按钮 */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setActiveIndex(null)}
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
              {blocks[activeIndex].title}
            </h2>

            {/* 显示内容 */}
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
                  您的浏览器不支持视频播放
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
