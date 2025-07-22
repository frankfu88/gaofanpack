"use client"; // ✅ 讓整個檔案變成 Client Component
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="zh-TW">
      <head>
        <title>高反急救包</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-white text-gray-900">
        <main className="pt-[10px] px-4">{children}</main>
      </body>
    </html>
  );
}
