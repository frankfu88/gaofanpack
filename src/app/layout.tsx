"use client"; // ✅ 讓整個檔案變成 Client Component

import { usePathname } from "next/navigation"; // ✅ 取得當前頁面路徑
import Navbar from "./Navbar";
import Banner from "./Banner";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // ✅ 取得當前路徑
  const isPricingPage = pathname === "/pricing"; // ✅ 檢查是否為「價格一覽」頁面

  return (
    <html lang="zh-TW">
      <head>
        <title>高反急救包</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-white text-gray-900">
        {/* ✅ Navbar 一直顯示 */}
        {/* <Navbar />  */}
       

        {/* 🔹 主要內容 */}
        <main className="pt-[100px] px-4">{children}</main>
      </body>
    </html>
  );
}
