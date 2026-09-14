"use client";

import Drawer from "@mui/material/Drawer";
import { FaComments, FaTrash } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";
import { useTranslation } from "react-i18next";

export default function MessagesDrawer({ open, onClose, messageNotifications, handleMessageClick }) {
  const { deleteNotification } = useNotifications();
  const { t } = useTranslation("common");
  return <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 430 }, background: "#0d0d0d", color: "#f7f1e6" } }}>
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_right,rgba(194,168,120,.14),transparent_30%),#0d0d0d]">
      <div className="border-b border-white/10 px-5 py-5"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#c2a878]">One Time Life Travel</p><div className="mt-1 flex items-center justify-between"><h2 className="font-[Cinzel] text-2xl">{t("messages")}</h2><span className="rounded-full border border-[#c2a878]/30 bg-[#c2a878]/10 px-3 py-1 text-xs text-[#e0bf78]">{messageNotifications.filter((item) => !item.is_read).length} {t("unread")}</span></div></div>
      <div className="flex-1 overflow-y-auto p-4">
        {messageNotifications.length ? <div className="space-y-3">{messageNotifications.map((item) => <button type="button" key={item.id} onClick={() => handleMessageClick(item)} className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#c2a878]/50 ${item.is_read ? "border-white/10 bg-white/[.025]" : "border-[#c2a878]/35 bg-[#c2a878]/10"}`}><img src={item.user_image || "/default-avatar.png"} alt="" className="h-11 w-11 shrink-0 rounded-2xl border border-[#c2a878]/30 object-cover" /><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#f7f1e6]">{item.user_name || t("traveler")}</strong><span className="mt-1 block truncate text-xs text-[#8e8577]">{item.user_email}</span><span className="mt-2 block text-sm leading-5 text-[#c8b99b]">{item.message}</span><time className="mt-2 block text-[10px] text-[#8e8577]">{new Date(item.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}</time></span><span onClick={(event) => { event.stopPropagation(); deleteNotification(item.id); }} role="button" tabIndex={0} aria-label={t("deleteMessageNotification")} className="rounded-lg p-2 text-[#8e8577] opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"><FaTrash size={12} /></span></button>)}</div> : <div className="flex h-full min-h-64 flex-col items-center justify-center text-center text-[#8e8577]"><FaComments className="mb-4 text-3xl text-[#c2a878]" /><p className="text-sm text-[#f7f1e6]">{t("noNewMessages")}</p><p className="mt-1 text-xs">{t("conversationsAppear")}</p></div>}
      </div>
    </div>
  </Drawer>;
}
