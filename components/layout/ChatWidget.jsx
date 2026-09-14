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
  const { messages, sendMessage, fetchMessages, markMessageSeen } =
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
  // ✅ فتح الدردشة بعد دقيقتين من تسجيل الدخول

  useEffect(() => {
    if (userData?.id) {
      const timer = setTimeout(async () => {
        setOpen(true); // يفتح نافذة الدردشة

        // ✅ إرسال الرسالة باسم الأدمن وليس المستخدم
        await sendMessage({
          user_id: "c7674367-18c9-4d2a-b94c-eb80ac716005", // أو ID الأدمن الحقيقي
          user_name: "👑  One Time Life Travel 👑",

          user_image: "/HomePageImage/Copilot_20260613_134423.webp",
          content:
           t("welcomeMessage", { defaultValue: "👋 Hello and welcome! The  One Time Life Travel team is excited to help you plan your next unforgettable journey. How can we assist you today?" }),
          sender_type: "admin", // مهم جداً لتظهر الرسالة بلون الأدمن
          status: "sent",
        });
      }, 30000); //  نص دقيقه

      return () => clearTimeout(timer);
    }
  }, []);

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

    // ✅ الرسالة الجديدة تدخل في الـ context
    await sendMessage({
      user_id: userData?.id,
      user_name: userData?.name,
      user_image:
        userData?.avatar_url || userData?.image || "/default-avatar.png",
      content: data.content, // الرابط النهائي للصورة
      sender_type: "user",
      status: "sent",
    });
  };

  return (
    <>
      {!isAdmin && (
        <motion.button
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg flex items-center justify-center ${theme.buttonPrimary}`}
        >
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
