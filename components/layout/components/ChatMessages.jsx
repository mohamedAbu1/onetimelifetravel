"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { saveAs } from "file-saver";
import { FaCheck, FaCheckDouble, FaComments, FaDownload, FaExpand } from "react-icons/fa";
import { useEffect, useRef } from "react";

export default function ChatMessages({ messages, adminTyping }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, adminTyping]);

  const handleDownload = async (url, id) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, `chat-image-${id}.jpg`);
  };

  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(194,168,120,.08),transparent_38%),#0d0d0d] px-4 py-5 sm:px-5">
      <div className="mx-auto mb-5 max-w-[280px] text-center text-[11px] leading-5 text-[#8e8577]">
        <span className="mx-auto mb-2 block h-8 w-px bg-[#c2a878]/40" />
        Your private line to One Time Life Travel
      </div>
      <AnimatePresence initial={false}>
        {messages.length ? messages.map((msg) => {
          const isUser = msg.sender_type === "user";
          const isImage = typeof msg.content === "string" && /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(msg.content);
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex items-end gap-2 ${isUser ? "justify-start" : "justify-end"}`}>
              {isUser && <img src={msg.user_image || "/default-avatar.png"} alt="" className="h-8 w-8 shrink-0 rounded-xl border border-white/10 object-cover" />}
              <div className={`max-w-[82%] ${isUser ? "items-start" : "items-end"}`}>
                <div className={`mb-1 px-1 text-[10px] font-semibold uppercase tracking-[.12em] ${isUser ? "text-[#8e8577]" : "text-[#e0bf78]"}`}>
                  {isUser ? msg.user_name || "You" : "One Time Life Travel"}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${isUser ? "rounded-bl-md border border-white/10 bg-[#1b1b1b] text-[#f7f1e6]" : "rounded-br-md bg-[#c2a878] text-[#15120e]"}`}>
                  {isImage ? (
                    <div className="group relative overflow-hidden rounded-xl">
                      <img src={msg.content} alt="Uploaded attachment" className="max-h-56 w-full object-cover" />
                      <div className="absolute inset-x-2 bottom-2 flex justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                        <button type="button" onClick={() => handleDownload(msg.content, msg.id)} className="rounded-lg bg-black/70 px-3 py-2 text-xs text-white"><FaDownload /></button>
                        <button type="button" onClick={() => window.open(msg.content, "_blank", "noopener,noreferrer")} className="rounded-lg bg-black/70 px-3 py-2 text-xs text-white"><FaExpand /></button>
                      </div>
                    </div>
                  ) : <p className="whitespace-pre-wrap break-words">{msg.content}</p>}
                </div>
                <div className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-[#8e8577] ${isUser ? "justify-start" : "justify-end"}`}>
                  {msg.created_at && formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  {!isUser && (msg.status === "seen" ? <FaCheckDouble className="text-[#c2a878]" /> : <FaCheck />)}
                </div>
              </div>
            </motion.div>
          );
        }) : (
          <div className="flex h-full min-h-64 flex-col items-center justify-center text-center text-[#8e8577]">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-[#c2a878]/25 bg-[#c2a878]/10 text-2xl text-[#e0bf78]"><FaComments /></span>
            <p className="font-semibold text-[#f7f1e6]">Start your conversation</p>
            <p className="mt-1 text-xs">Our travel team is ready to help.</p>
          </div>
        )}
      </AnimatePresence>
      {adminTyping && <div className="flex items-center gap-2 text-xs text-[#8e8577]"><span className="flex gap-1 rounded-full bg-white/5 px-3 py-2"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c2a878]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c2a878] [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#c2a878] [animation-delay:240ms]" /></span>Travel team is typing</div>}
      <div ref={messagesEndRef} />
    </div>
  );
}
