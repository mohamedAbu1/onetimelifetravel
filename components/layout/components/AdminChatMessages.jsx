"use client";

import { motion } from "framer-motion";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function AdminChatMessages({ messages, adminTyping }) {
  const { t } = useTranslation("common");
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, adminTyping]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(194,168,120,.08),transparent_38%),#0d0d0d] px-4 py-5">
      {messages.length ? messages.map((msg) => {
        const isAdmin = msg.sender_type === "admin";
        const isImage = typeof msg.content === "string" && /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(msg.content);
        return <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex items-end gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
          {!isAdmin && <img src={msg.user_image || "/default-avatar.png"} alt="" className="h-8 w-8 rounded-xl border border-white/10 object-cover" />}
          <div className={`max-w-[82%] ${isAdmin ? "items-end" : "items-start"}`}>
            <div className={`mb-1 px-1 text-[10px] font-semibold uppercase tracking-[.12em] ${isAdmin ? "text-[#e0bf78]" : "text-[#8e8577]"}`}>{isAdmin ? "One Time Life Travel" : msg.user_name || "Traveler"}</div>
            <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${isAdmin ? "rounded-br-md bg-[#c2a878] text-[#15120e]" : "rounded-bl-md border border-white/10 bg-[#1b1b1b] text-[#f7f1e6]"}`}>
              {isImage ? <img src={msg.content} alt="Uploaded attachment" className="max-h-56 rounded-xl object-cover" /> : <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
            </div>
            <div className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-[#8e8577] ${isAdmin ? "justify-end" : "justify-start"}`}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}{isAdmin && (msg.status === "seen" ? <FaCheckDouble className="text-[#c2a878]" /> : <FaCheck />)}</div>
          </div>
        </motion.div>;
      }) : <div className="flex h-full min-h-64 items-center justify-center text-sm text-[#8e8577]">{t("noMessages")}</div>}
      {adminTyping && <div className="text-xs text-[#8e8577]">{t("travelerTyping")}</div>}
      <div ref={endRef} />
    </div>
  );
}
