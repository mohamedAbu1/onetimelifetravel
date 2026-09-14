"use client";
import { FaHeadset, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ChatHeader({ onClose }) {
    const { t } = useTranslation("home");
  
  return (
    <div className="relative flex items-center justify-between overflow-hidden border-b border-white/10 bg-[#17130e]/95 px-5 py-4 text-[#f7f1e6] backdrop-blur-xl">
      <div className="absolute inset-y-0 left-0 w-32 bg-[#c2a878]/10 blur-2xl" />
      <div className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e0bf78]/40 bg-[#e0bf78]/10 text-[#e0bf78]"><FaHeadset /></span>
        <span>
          <strong className="block font-[Cinzel] text-sm tracking-wide">One Time Life Travel</strong>
          <span className="mt-0.5 block text-[11px] text-[#c8b99b]">{t("Support") || "Travel support"} · Online</span>
        </span>
      </div>
      <button type="button" onClick={onClose} aria-label="Close chat" className="relative rounded-full p-2 text-[#c8b99b] transition hover:bg-white/10 hover:text-white">
        <FaTimes />
      </button>
    </div>
  );
}
