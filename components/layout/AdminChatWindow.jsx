"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AdminChatMessages from "./components/AdminChatMessages";
import AdminChatInput from "./components/AdminChatInput";
import { useMessages } from "@/context/MessageContext";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { useChat } from "@/context/ChatContext";

export default function AdminChatWindow({ user, admin, messages, onClose }) {
  const { theme, themeName } = useTheme();
  const [text, setText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);

  const { setMessages, setActiveChatUserId } = useMessages();

  // ✅ تحديد المستخدم النشط
  useEffect(() => {
    setActiveChatUserId(user.id);
    return () => setActiveChatUserId(null);
  }, [user.id]);

  // ✅ استعلام حالة الكتابة للأدمن
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${user.id}`);
      const data = await res.json();
      setAdminTyping(data.adminTyping || false);
    }, 2000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // ✅ إرسال رسالة نصية
  const handleSend = async () => {
    if (text.trim() !== "") {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          user_name: " One Time Life Travel",
          user_image:
            admin?.avatar_url || admin?.image || "/default-avatar.png",
          content: text,
          sender_type: "admin",
          status: "sent",
          admin_id: admin?.id || "SYSTEM", // ✅ قيمة افتراضية
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]); // ✅ أضف الرسالة مباشرة
      setText("");

      setText("");
    }
  };

  // ✅ إرسال صورة
  const handleSendImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);
    formData.append("user_name", " One Time Life Travel");
    formData.append(
      "user_image",
      admin?.avatar_url || admin?.image || "/default-avatar.png",
    );
    formData.append("sender_type", "admin");
    formData.append("admin_id", admin?.id || "SYSTEM");

    const res = await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.content) return;
    setMessages((prev) => [...prev, data]); // ✅ إضافة الرسالة محليًا
  };

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 flex h-[min(700px,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-[450px] flex-col overflow-hidden rounded-[1.5rem] border border-[#c2a878]/30 bg-[#0d0d0d]/95 text-[#f7f1e6] shadow-[0_24px_90px_rgba(0,0,0,.6)] backdrop-blur-2xl sm:bottom-6 sm:right-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-[#17130e]/95 px-5 py-4">
            <div className="flex items-center gap-2">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                className="h-11 w-11 rounded-2xl border border-[#c2a878]/50 object-cover"
              />
              <span><strong className="block font-[Cinzel] text-sm capitalize">{user.name || "Traveler"}</strong><span className="mt-1 flex items-center gap-1 text-[11px] text-[#8e8577]"><FaUserCircle className="text-[#c2a878]" /> Customer conversation</span></span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="rounded-full p-2 text-[#8e8577] transition hover:bg-white/10 hover:text-white"
            >
              <motion.div
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTimes size={18} />
              </motion.div>
            </button>
          </div>

          <AdminChatMessages
            messages={messages.filter((msg) => msg.user_id === user.id)}
            themeName={themeName}
            adminTyping={adminTyping}
          />

          <AdminChatInput
            text={text}
            setText={setText}
            handleSend={handleSend}
            theme={theme}
            themeName={themeName}
            user={user}
            handleSendImage={handleSendImage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
