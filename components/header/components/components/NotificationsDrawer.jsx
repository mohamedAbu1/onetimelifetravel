"use client";

import Drawer from "@mui/material/Drawer";
import { FaBell, FaCalendarCheck, FaHeart, FaTrash, FaStar } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";

const iconFor = (type) => type === "purchase" ? <FaCalendarCheck /> : type === "review_like" ? <FaHeart /> : type === "review" ? <FaStar /> : <FaBell />;

export default function NotificationsDrawer({ open, onClose, handleNotificationClick }) {
  const { notifications, deleteNotification } = useNotifications();
  const filtered = notifications.filter((item) => item.event_type !== "message").filter((item) => Date.now() - new Date(item.created_at).getTime() < 2 * 24 * 60 * 60 * 1000).sort((a, b) => Number(a.is_read) - Number(b.is_read) || new Date(b.created_at) - new Date(a.created_at));

  return <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 430 }, background: "#0d0d0d", color: "#f7f1e6" } }}>
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top_right,rgba(194,168,120,.14),transparent_30%),#0d0d0d]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#c2a878]">One Time Life Travel</p><h2 className="mt-1 font-[Cinzel] text-2xl">Notifications</h2></div><span className="rounded-full border border-[#c2a878]/30 bg-[#c2a878]/10 px-3 py-1 text-xs text-[#e0bf78]">{filtered.filter((item) => !item.is_read).length} new</span></div>
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length ? <div className="space-y-3">{filtered.map((item) => <button type="button" key={item.id} onClick={() => handleNotificationClick(item)} className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#c2a878]/50 ${item.is_read ? "border-white/10 bg-white/[.025]" : "border-[#c2a878]/35 bg-[#c2a878]/10"}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c2a878]/15 text-[#e0bf78]">{iconFor(item.event_type)}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#f7f1e6]">{item.user_name || "Travel update"}</strong><span className="mt-1 block text-xs leading-5 text-[#c8b99b]">{item.message}</span><time className="mt-2 block text-[10px] text-[#8e8577]">{new Date(item.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}</time></span><span onClick={(event) => { event.stopPropagation(); deleteNotification(item.id); }} role="button" tabIndex={0} aria-label="Delete notification" className="rounded-lg p-2 text-[#8e8577] opacity-0 transition hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100"><FaTrash size={12} /></span></button>)}</div> : <div className="flex h-full min-h-64 flex-col items-center justify-center text-center text-[#8e8577]"><FaBell className="mb-4 text-3xl text-[#c2a878]" /><p className="text-sm text-[#f7f1e6]">You are all caught up</p><p className="mt-1 text-xs">New travel updates will appear here.</p></div>}
      </div>
    </div>
  </Drawer>;
}
