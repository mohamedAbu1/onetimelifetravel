"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCarSide, FaCheckCircle, FaClock, FaRoute, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const initialForm = { vehicleType: "sedan", serviceType: "one_way", passengers: 1, luggage: 0, pickupLocation: "", dropoffLocation: "", pickupDate: "", pickupTime: "", flightNumber: "", notes: "" };

export default function CarBookingModal({ open, onClose }) {
  const { t } = useTranslation("common");
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const field = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const label = (key, fallback) => t(key, { defaultValue: fallback });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/car-bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save booking");
      toast.success(label("carBookingSaved", "Your car request was sent. Our team will confirm it shortly."));
      setForm(initialForm);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally { setSaving(false); }
  };

  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div role="dialog" aria-modal="true" aria-labelledby="car-booking-title" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .98 }} className="car-booking-modal max-h-[min(92vh,850px)] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-[#d1b06a]/40 bg-[#101719] text-[#f7f1e6] shadow-[0_30px_100px_rgba(0,0,0,.6)]">
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-[#101719]/95 px-5 py-5 backdrop-blur-xl sm:px-7"><div><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.25em] text-[#d1b06a]"><FaCarSide /> {label("signatureMobility", "Signature mobility")}</p><h2 id="car-booking-title" className="mt-2 font-[Cinzel] text-2xl font-semibold sm:text-3xl">{label("bookYourCar", "Book your car")}</h2><p className="mt-2 text-xs leading-5 text-[#a9aaa1]">{label("carBookingSubtitle", "Tell us what you need and our travel team will arrange a smooth door-to-door transfer.")}</p></div><button type="button" onClick={onClose} aria-label={label("close", "Close")} className="rounded-full p-2 text-[#a9aaa1] transition hover:bg-white/10 hover:text-white"><FaTimes /></button></div>
      <form onSubmit={submit} className="grid gap-5 p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-2"><label className="car-booking-field"><span>{label("vehicleType", "Vehicle type")}</span><select value={form.vehicleType} onChange={(e) => field("vehicleType", e.target.value)}><option value="sedan">{label("sedan", "Sedan · up to 3 guests")}</option><option value="suv">{label("suv", "SUV · up to 4 guests")}</option><option value="minivan">{label("minivan", "Minivan · up to 7 guests")}</option><option value="luxury">{label("luxury", "Luxury · up to 3 guests")}</option></select></label><label className="car-booking-field"><span>{label("serviceType", "Service type")}</span><select value={form.serviceType} onChange={(e) => field("serviceType", e.target.value)}><option value="one_way">{label("oneWay", "One-way transfer")}</option><option value="round_trip">{label("roundTrip", "Round trip")}</option><option value="hourly">{label("hourly", "By the hour")}</option></select></label></div>
        <div className="grid grid-cols-2 gap-4"><label className="car-booking-field"><span>{label("passengers", "Passengers")}</span><input type="number" min="1" max="50" value={form.passengers} onChange={(e) => field("passengers", e.target.value)} required /></label><label className="car-booking-field"><span>{label("luggage", "Luggage")}</span><input type="number" min="0" max="50" value={form.luggage} onChange={(e) => field("luggage", e.target.value)} /></label></div>
        <div className="grid gap-4 md:grid-cols-2"><label className="car-booking-field"><span><FaRoute /> {label("pickupLocation", "Pickup location")}</span><input value={form.pickupLocation} onChange={(e) => field("pickupLocation", e.target.value)} placeholder={label("pickupPlaceholder", "Hotel, airport or address")} required /></label><label className="car-booking-field"><span><FaRoute /> {label("dropoffLocation", "Drop-off location")}</span><input value={form.dropoffLocation} onChange={(e) => field("dropoffLocation", e.target.value)} placeholder={label("dropoffPlaceholder", "Where should we take you?")} required /></label></div>
        <div className="grid gap-4 md:grid-cols-2"><label className="car-booking-field"><span>{label("pickupDate", "Pickup date")}</span><input type="date" min={today} value={form.pickupDate} onChange={(e) => field("pickupDate", e.target.value)} required /></label><label className="car-booking-field"><span><FaClock /> {label("pickupTime", "Pickup time")}</span><input type="time" value={form.pickupTime} onChange={(e) => field("pickupTime", e.target.value)} required /></label></div>
        <div className="grid gap-4 md:grid-cols-2"><label className="car-booking-field"><span>{label("flightNumber", "Flight number (optional)")}</span><input value={form.flightNumber} onChange={(e) => field("flightNumber", e.target.value)} placeholder="e.g. MS901" /></label><label className="car-booking-field"><span>{label("notes", "Special requests (optional)")}</span><input value={form.notes} onChange={(e) => field("notes", e.target.value)} placeholder={label("notesPlaceholder", "Child seat, accessibility, extra stop…")} /></label></div>
        <div className="flex items-start gap-3 rounded-2xl border border-[#d1b06a]/20 bg-[#d1b06a]/[.06] p-4 text-xs leading-5 text-[#c6c0b3]"><FaCheckCircle className="mt-0.5 shrink-0 text-[#d1b06a]" /><span>{label("carBookingNotice", "Your request is subject to availability. Our team will contact you to confirm the vehicle and final price.")}</span></div>
        <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#d1b06a] px-6 text-sm font-black uppercase tracking-[.12em] text-[#121514] transition hover:bg-[#e4c982] disabled:cursor-wait disabled:opacity-60">{saving ? label("sending", "Sending…") : label("sendCarRequest", "Send car request")}</button>
      </form>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}
