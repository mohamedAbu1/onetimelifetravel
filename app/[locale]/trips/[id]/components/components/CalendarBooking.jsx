"use client";

import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarBooking({ tripId, prise, setCheckInPrice, checkInPrice, checkIn, setCheckIn, checkOut, setCheckOut }) {
  const { t } = useTranslation("common");
  const today = useMemo(() => startOfDay(new Date()), []);
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const monthKey = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const firstDay = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7;
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const storageKey = `calendarPrices_v2_${tripId}_${monthKey}`;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved) && saved.length === daysInMonth) { setPrices(saved); return; }
    } catch { /* regenerate invalid cached data */ }
    const base = Number(prise) || 0;
    // Smooth deterministic variation: every day stays within ±$3 of the base price.
    // The sine curve avoids abrupt jumps while keeping dates visibly different.
    const generated = Array.from({ length: daysInMonth }, (_, index) => {
      const offset = Math.round(Math.sin((index + visibleMonth.getMonth() * 2) * 0.85) * 3);
      return Math.max(0, Number((base + offset).toFixed(2)));
    });
    setPrices(generated);
    localStorage.setItem(storageKey, JSON.stringify(generated));
  }, [daysInMonth, monthKey, prise, tripId, visibleMonth]);

  const dateKey = (day) => `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const selectedDate = (day) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
  const selectDate = (day) => {
    const date = selectedDate(day);
    if (date < today) return;
    const value = dateKey(day);
    if (!checkIn || checkOut) { setCheckIn(value); setCheckOut(null); setCheckInPrice(prices[day - 1] || Number(prise) || 0); return; }
    if (value === checkIn) { setCheckIn(null); setCheckInPrice(null); return; }
    if (date > new Date(checkIn)) setCheckOut(value);
  };
  const canGoPrevious = visibleMonth.getFullYear() > today.getFullYear() || visibleMonth.getMonth() > today.getMonth();
  const changeMonth = (amount) => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  const isBetween = (value) => checkIn && checkOut && new Date(value) > new Date(checkIn) && new Date(value) < new Date(checkOut);

  return <div className="trip-calendar-panel rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
    <div className="mb-5 flex items-center justify-between"><button type="button" aria-label={t("previousMonth")} disabled={!canGoPrevious} onClick={() => changeMonth(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#d1b06a] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"><FaChevronLeft /></button><div className="text-center"><p className="text-[10px] uppercase tracking-[0.24em] text-[#9d9384]">{t("chooseDates")}</p><h3 className="mt-1 font-[Cinzel] text-lg text-[#f4ead8]">{monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</h3></div><button type="button" aria-label={t("nextMonth")} onClick={() => changeMonth(1)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[#d1b06a] transition hover:bg-white/10"><FaChevronRight /></button></div>
    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-[#8f8678]">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
    <div className="grid grid-cols-7 gap-1.5">{Array.from({ length: firstDay }).map((_, index) => <span key={`empty-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => { const day = index + 1; const value = dateKey(day); const past = selectedDate(day) < today; const start = value === checkIn; const end = value === checkOut; return <div key={value} className="min-w-0 text-center"><button type="button" disabled={past} onClick={() => selectDate(day)} className={`flex aspect-square w-full items-center justify-center rounded-lg text-xs transition ${past ? "cursor-not-allowed text-[#514b43]" : start || end ? "bg-[#d1b06a] font-bold text-[#15120e]" : isBetween(value) ? "bg-[#d1b06a]/25 text-[#ead39e]" : "text-[#c8beaf] hover:bg-white/10"}`}>{day}</button>{!past && <span className="mt-1 block truncate text-[9px] text-[#8f8678]">{prices[index] ? `$${Math.round(prices[index])}` : ""}</span>}</div>; })}</div>
    <div className="mt-5 grid gap-2 sm:grid-cols-2"><DateBox icon={<FaCalendarAlt />} label={t("checkIn")} value={checkIn} empty={t("selectDate")} /><DateBox icon={<FaCalendarAlt />} label={t("checkOut")} value={checkOut} empty={t("selectDate")} /></div>
    {checkIn && checkOut && <p className="mt-4 rounded-lg bg-[#d1b06a]/10 px-3 py-2 text-center text-xs text-[#d9c28d]">{t("datesSelected")}</p>}
    {(checkIn || checkOut) && <button type="button" onClick={() => { setCheckIn(null); setCheckInPrice(null); setCheckOut(null); }} className="mt-4 w-full rounded-full border border-white/15 py-2 text-xs text-[#aaa092] transition hover:border-[#d1b06a] hover:text-[#ead39e]">{t("clearSelectedDates")}</button>}
  </div>;
}

function DateBox({ icon, label, value, empty }) { return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#d1b06a]">{icon}{label}</p><p className="mt-2 text-sm text-[#f4ead8]">{value || empty}</p></div>; }
function startOfDay(date) { const copy = new Date(date); copy.setHours(0, 0, 0, 0); return copy; }
