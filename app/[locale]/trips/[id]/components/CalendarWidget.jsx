"use client";

import { useState } from "react";
import CalendarBooking from "./components/CalendarBooking";
import BookingSummaryCard from "./components/BookingSummaryCard";
import WhatsAppBookingForm from "@/components/trips/WhatsAppBookingForm";
import { useTranslation } from "react-i18next";
import { applySeasonalDiscount } from "@/lib/seasonalEvents";
import { useSeasonalEvent } from "@/components/layout/useSeasonalEvent";

export default function CalendarWidget({ trip, id }) {
  const { t } = useTranslation("common");
  const seasonalEvent = useSeasonalEvent();
  const [participants, setParticipants] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [checkInPrice, setCheckInPrice] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const hasGuests = participants + childrenCount > 0;

  return <section className="w-full rounded-[1.35rem] border border-[#d1b06a]/45 bg-[#151515] p-5 text-[#f4ead8] shadow-[0_18px_50px_rgba(0,0,0,.3)]">
    <div className="mb-5"><p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d1b06a]">{t("planDates")}</p><h2 className="mt-2 font-[Cinzel] text-2xl font-semibold">{t("reserveJourney")}</h2><p className="mt-2 text-xs leading-5 text-[#a79d8d]">{t("chooseGroupDates")}</p>{seasonalEvent && <span className="mt-3 inline-flex rounded-full border border-[#d1b06a]/40 bg-[#d1b06a]/10 px-3 py-1 text-[10px] font-bold text-[#ead39e]">{seasonalEvent.icon} {seasonalEvent.discount}% {t("seasonalDiscount")}</span>}</div>
    <div className="grid gap-3 sm:grid-cols-2">
      <GuestCounter label="Adults" hint="Age 6+" value={participants} onDecrease={() => setParticipants(Math.max(0, participants - 1))} onIncrease={() => setParticipants(participants + 1)} />
      <GuestCounter label="Children" hint="Under 12" value={childrenCount} onDecrease={() => setChildrenCount(Math.max(0, childrenCount - 1))} onIncrease={() => setChildrenCount(childrenCount + 1)} />
    </div>
    {!hasGuests ? <div className="my-5 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center"><p className="text-sm text-[#ead39e]">{t("addGuests")}</p><p className="mt-2 text-xs text-[#918879]">{t("calendarAppear")}</p></div> : <div className="mt-5"><CalendarBooking prise={applySeasonalDiscount(trip.solo_price, seasonalEvent)} checkInPrice={checkInPrice} setCheckInPrice={setCheckInPrice} setCheckOut={setCheckOut} checkOut={checkOut} checkIn={checkIn} setCheckIn={setCheckIn} tripId={id} /></div>}
    <div className="mt-4"><BookingSummaryCard tourName={trip.title?.en || "Egyptian journey"} checkInPrice={checkInPrice} participants={participants} childrenCount={childrenCount} checkOut={checkOut} checkIn={checkIn} tripId={id} onBookingClick={() => setIsWhatsAppOpen(true)} /></div>
    {isWhatsAppOpen && <WhatsAppBookingForm trip={trip} initialTravelers={participants + childrenCount} initialDate={checkIn} onClose={() => setIsWhatsAppOpen(false)} />}
  </section>;
}

function GuestCounter({ label, hint, value, onDecrease, onIncrease }) {
  return <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3"><div><p className="text-sm font-semibold text-[#f4ead8]">{label}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-[#918879]">{hint}</p></div><div className="flex items-center gap-2"><button type="button" onClick={onDecrease} disabled={!value} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-[#d1b06a] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30">−</button><span className="w-5 text-center text-sm text-[#f4ead8]">{value}</span><button type="button" onClick={onIncrease} className="grid h-8 w-8 place-items-center rounded-full bg-[#d1b06a] text-lg text-[#15120e] transition hover:bg-[#ead39e]">+</button></div></div>;
}
