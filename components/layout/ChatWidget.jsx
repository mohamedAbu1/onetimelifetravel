"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useMessages } from "@/context/MessageContext";
import { FaComments } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useChat } from "@/context/ChatContext";
import { useTranslation } from "react-i18next";
export default function ChatWidget({ setShowEmojiPicker, showEmojiPicker }) {
  const { theme, themeName } = useTheme();
  const { messages, sendMessage, fetchMessages, markMessageSeen, setMessages } =
    useMessages();
  const [text, setText] = useState("");
  const { userData } = useAuth(); // ✅ بيانات من AuthContext
  const [adminTyping, setAdminTyping] = useState(false);
  const {
    open,
    bookingMode,
    from,
    setFrom,
    setOpen,
    to,
    setTo,
    setBookingMode,
    setMessageses,
  } = useChat();
    const { t } = useTranslation("home");
    const { t: tc } = useTranslation("common");

  // ✅ جلب رسائل المستخدم
  useEffect(() => {
    if (userData?.id) {
      fetchMessages(userData.id);
    }
  }, [userData]);

  // ✅ تحديث حالة الرسائل إلى "seen"
  useEffect(() => {
    if (userData?.id && messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.sender_type === "admin" && msg.status === "sent") {
          markMessageSeen(msg.id);
        }
      });
    }
  }, [userData, messages]);
  // Send the onboarding message once per account, 20 seconds after login.
  useEffect(() => {
    const userId = userData?.id;
    if (!userId || userData?.role?.toLowerCase() === "admin") return undefined;

    const storageKey = `otl-welcome-message-sent:${userId}`;
    if (window.localStorage.getItem(storageKey) === "1") return undefined;

    const timer = setTimeout(async () => {
      if (window.localStorage.getItem(storageKey) === "1") return;
      try {
        const result = await sendMessage({
          user_id: userId,
          user_name: "👑 One Time Life Travel 👑",
          user_image: "/HomePageImage/Copilot_20260613_134423.webp",
          content: t("welcomeMessage", { defaultValue: "👋 Hello and welcome! The One Time Life Travel team is excited to help you plan your next unforgettable journey. How can we assist you today?" }),
          sender_type: "admin",
          status: "sent",
        });
        if (result?.error) return;
        window.localStorage.setItem(storageKey, "1");
        setOpen(true);
      } catch (error) {
        console.error("Welcome message failed:", error);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [userData?.id, userData?.role]);

  // ✅ استعلام حالة الكتابة للأدمن
  useEffect(() => {
    if (!userData?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${userData.id}`);
      const data = await res.json();
      setAdminTyping(data.adminTyping || false);
    }, 2000);
    return () => clearInterval(interval);
  }, [userData?.id]);

  const handleSend = async () => {
    if (text.trim() !== "") {
      await sendMessage({
        user_id: userData?.id,
        user_name: userData?.name,
        user_image:
          userData?.avatar_url || userData?.image || "/default-avatar.png",
        content: text,
        sender_type: "user",
        status: "sent",
      });
      setText("");
    }
  };

  const isAdmin = userData?.role === "ADMIN";

  const handleSendImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ لازم تبعت بيانات المستخدم مع الصورة
    formData.append("user_id", userData?.id);
    formData.append("user_name", userData?.name || "Unknown User");
    formData.append(
      "user_image",
      userData?.avatar_url || userData?.image || "/default-avatar.png",
    );
    formData.append("sender_type", "user");
    formData.append("admin_id", "SYSTEM"); // أو أي قيمة مناسبة

    const res = await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.content) return;

    // The multipart API already stores and returns the message; do not send it again.
    setMessages((prev) => [...prev.filter((message) => String(message.id) !== String(data.id)), data]);
  };

  return (
    <>
      {!isAdmin && (
        <motion.button
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={tc("openChat")}
          className={`chat-fab fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-[#e0bf78]/70 shadow-[0_16px_45px_rgba(0,0,0,.4)] transition sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-6 ${theme.buttonPrimary}`}
        >
          <span className="chat-fab-ring" />
          <FaComments size={22} color="#fff" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 flex h-[min(680px,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-[430px] flex-col overflow-hidden rounded-[1.5rem] border border-[#c2a878]/30 bg-[#0d0d0d]/95 text-[#f7f1e6] shadow-[0_24px_90px_rgba(0,0,0,.55)] backdrop-blur-2xl sm:bottom-6 sm:right-6"
          >
            <ChatHeader onClose={() => setOpen(false)} theme={theme} />
            <ChatMessages
              messages={messages}
              adminTyping={adminTyping}
              themeName={themeName}
            />

            {bookingMode ? (
              <div className="m-4 rounded-2xl border border-[#c2a878]/20 bg-[#17130e] p-5 shadow-inner">
                <p className="mb-4 text-base font-semibold text-[#f7f1e6]">
                  🚗 {tc("carBookingPrompt")}
                </p>

                <input
                  type="text"
                  placeholder={tc("from")}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#8e8577] focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20"
                />

                <input
                  type="text"
                  placeholder={tc("to")}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#8e8577] focus:border-[#c2a878] focus:ring-2 focus:ring-[#c2a878]/20"
                />

                <button
                  onClick={() => {
                    const bookingMessage = `🚗 Car booking request from ${from} to ${to}`;
                    setText(bookingMessage); // ✅ يملأ النص
                    handleSend(); // يرسل الرسالة للـ backend
                    setMessageses((prev) => [
                      ...prev,
                      {
                        sender: "assistant",
                        content:
                          tc("carRequestRecorded"),
                      },
                    ]);
                    setBookingMode(false);
                  }}
                  className="mt-4 w-full rounded-xl bg-[#c2a878] px-6 py-3 text-sm font-bold text-[#15120e] shadow-lg shadow-[#c2a878]/10 transition hover:bg-[#e0bf78]"
                >
                  {tc("confirmBooking")}
                </button>
              </div>
            ) : (
              <ChatInput
                text={text}
                setText={setText}
                handleSend={handleSend}
                handleSendImage={handleSendImage}
                theme={theme}
                themeName={themeName}
                user={userData}
                setShowEmojiPicker={setShowEmojiPicker}
                showEmojiPicker={showEmojiPicker}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
