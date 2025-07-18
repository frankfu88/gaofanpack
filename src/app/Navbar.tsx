"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // 確保 Client Side 渲染

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // **滾動處理**
  const handleNavClick = (id: string) => {
    if (!isClient) return;

    if (pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }

    setIsOpen(false); // ✅ 收起選單
  };

  return (
    <header className="bg-white text-gray-900 py-4 fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>☰</button>

        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <button onClick={() => handleNavClick("unboxing")} className="hover:text-gray-600">開箱說明</button>
          <button onClick={() => handleNavClick("application")} className="hover:text-gray-600">使用說明</button>
          <button onClick={() => handleNavClick("product")} className="hover:text-gray-600">產品說明</button>
          <button onClick={() => handleNavClick("notice")} className="hover:text-gray-600">注意事項</button>
          <button onClick={() => handleNavClick("service")} className="hover:text-gray-600">服務單位</button>
        </nav>
      </div>

      {/* ✅ 手機版選單修正 */}
      {isOpen && (
        <nav className="md:hidden bg-gray-100 text-gray-900 py-4 space-y-3 text-center">
          <button onClick={() => handleNavClick("unboxing")} className="hover:text-gray-600">開箱說明</button>
          <button onClick={() => handleNavClick("application")} className="hover:text-gray-600">使用說明</button>
          <button onClick={() => handleNavClick("product")} className="hover:text-gray-600">產品說明</button>
          <button onClick={() => handleNavClick("notice")} className="hover:text-gray-600">注意事項</button>
          <button onClick={() => handleNavClick("service")} className="hover:text-gray-600">服務單位</button>
        </nav>
      )}
    </header>
  );
}
