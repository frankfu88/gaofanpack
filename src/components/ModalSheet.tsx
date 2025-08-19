import { FaTimes } from "react-icons/fa";
import { PropsWithChildren } from "react";

export default function ModalSheet({ title, onClose, children }: PropsWithChildren<{ title: string; onClose: () => void }>) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <button aria-label="关闭" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-none sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 max-h-[92vh] sm:max-h-[86vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}><FaTimes size={22} /></button>
        <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-3 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}