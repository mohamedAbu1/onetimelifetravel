"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperclip, FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export default function AdminChatInput({ text, setText, handleSend, handleSendImage, user }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const updateTyping = (value) => {
    setText(value);
    fetch("/api/typing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user?.id, isTyping: value.length > 0 }) }).catch(() => {});
  };

  return (
    <div className="relative border-t border-white/10 bg-[#111]/95 p-3 backdrop-blur-xl">
      {showEmojiPicker && <div className="absolute bottom-[calc(100%+8px)] right-3 z-50 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl shadow-2xl"><Picker data={data} onEmojiSelect={(emoji) => updateTyping(`${text}${emoji.native}`)} theme="dark" previewPosition="none" /></div>}
      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[.04] p-2 focus-within:border-[#c2a878]/60">
        <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#8e8577] transition hover:bg-white/10 hover:text-[#e0bf78]"><FaPaperclip /><input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleSendImage(file); event.target.value = ""; }} /></label>
        <input value={text} onChange={(event) => updateTyping(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }} placeholder="Reply to traveler..." aria-label="Reply" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-[#f7f1e6] outline-none placeholder:text-[#716b61]" />
        <button type="button" onClick={() => setShowEmojiPicker((visible) => !visible)} aria-label="Add emoji" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#8e8577] transition hover:bg-white/10 hover:text-[#e0bf78]"><FaSmile /></button>
        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={handleSend} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c2a878] text-[#15120e] transition hover:bg-[#e0bf78]"><FaPaperPlane className="text-sm" /></motion.button>
      </div>
    </div>
  );
}
