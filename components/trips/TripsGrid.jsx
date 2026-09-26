"use client";

import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { applySeasonalDiscount } from "@/lib/seasonalEvents";
import { useSeasonalEvent } from "@/components/layout/useSeasonalEvent";
import { DEFAULT_IMAGE, normalizeImageUrl } from "@/lib/imageUrl";

function TripCardImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(src || DEFAULT_IMAGE);

  useEffect(() => {
    setImageSrc(src || DEFAULT_IMAGE);
  }, [src]);

  return <img src={imageSrc} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} loading="lazy" decoding="async" onError={() => setImageSrc(DEFAULT_IMAGE)} />;
}

function WhatsAppBookingForm({ trip, onClose }) {
  const title = trip.title?.en || trip.title?.ar || "Egyptian journey";
  const [form, setForm] = useState({ name: "", phone: "", travelers: "1", date: "", notes: "" });
  const submit = (event) => {
    event.preventDefault();
    const message = [
      "Hello One Time Life Travel, I would like to book:",
      `Trip: ${title}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Travelers: ${form.travelers}`,
      form.date ? `Preferred date: ${form.date}` : "",
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/201009011178?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="WhatsApp booking form" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form onSubmit={submit} className="w-full max-w-lg rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--text)] shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--primary-color)]">Book via WhatsApp</p><h2 className="mt-2 font-[Cinzel] text-2xl text-[var(--heading)]">{title}</h2></div><button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-xl text-[var(--sub-text)] hover:bg-[var(--primary-color)]/10" aria-label="Close">×</button></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Phone / WhatsApp<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Travelers<input required min="1" type="number" value={form.travelers} onChange={(event) => setForm({ ...form, travelers: event.target.value })} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Preferred date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label></div>
      <label className="mt-4 grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows="3" className="resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label>
      <button type="submit" className="mt-5 w-full rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]">Continue to WhatsApp</button>
    </form>
  </div>;
}

export default function TripsGrid({ trips = [], cardStyle = "vertical" }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const { userData } = useAuth();
  const { currency, purchases = [] } = usePurchase();
  const { rates } = useCurrency();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const seasonalEvent = useSeasonalEvent();
  const [bookingTrip, setBookingTrip] = useState(null);

  const convertPrice = (price, tripCurrency) => {
    const amount = Number(price) || 0;
    if (currency === tripCurrency) return amount.toFixed(2);
    if (currency === "EUR" && tripCurrency === "USD") return (amount * (rates?.EUR || 0.85)).toFixed(2);
    if (currency === "USD" && tripCurrency === "EUR") return (amount / (rates?.EUR || 1.18)).toFixed(2);
    if (currency === "EGP" && tripCurrency === "USD") return (amount * (rates?.USD || 49.1)).toFixed(2);
    if (currency === "USD" && tripCurrency === "EGP") return (amount / (rates?.USD || 49.1)).toFixed(2);
    return amount.toFixed(2);
  };

  return <><div className={`grid flex-1 gap-5 ${cardStyle === "vertical" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
    {trips.map((trip, index) => {
      const title = trip.title?.[lang] || trip.title?.en || "Untitled trip";
      const cities = getLocalizedNames(trip.cities, lang);
      const categories = getLocalizedNames(trip.categories, lang);
      const purchased = purchases.some((purchase) => purchase.user_id?.toString() === userData?.id?.toString() && purchase.trip_id?.toString() === trip.id?.toString() && purchase.status !== "Cancelled");
      const imageValues = [
        ...(Array.isArray(trip.gallery_images) ? trip.gallery_images : []),
        ...(Array.isArray(trip.images) ? trip.images : []),
        trip.cover_image,
      ].map((image) => (typeof image === "string" ? image : image?.url)).filter(Boolean);
      const image = normalizeImageUrl(imageValues[0] || DEFAULT_IMAGE);
      return <motion.article key={trip.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }} className={`group overflow-hidden rounded-[1.5rem] border border-[var(--card-border)]/70 bg-[var(--card-bg)] shadow-[0_18px_50px_rgba(0,0,0,.16)] ${cardStyle === "horizontal" ? "md:flex" : ""}`}>
        <div className={`relative overflow-hidden ${cardStyle === "horizontal" ? "h-64 md:h-auto md:w-2/5" : "h-60"}`}><TripCardImage src={image} alt={title} className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ead39e] backdrop-blur-md">{trip.duration || "Egypt journey"}</div></div>
        <div className="flex flex-1 flex-col justify-between p-5"><div><div className="mb-3 flex items-center justify-between gap-2"><span className="text-xs text-[var(--primary-color)]">{cities || "Egypt"}</span><span className="flex items-center gap-1 text-xs text-[var(--primary-color)]"><FaStar /> {trip.rating || "4.5"}</span></div><h2 className="line-clamp-2 font-[Cinzel] text-xl font-semibold leading-snug text-[var(--heading)]">{title}</h2><p className="mt-3 line-clamp-1 text-xs text-[var(--sub-text)]">{categories || t("NoCategory")}</p></div><div className="mt-6 flex items-center justify-between gap-3"><p className="text-lg font-semibold text-[var(--primary-color)]">{convertPrice(applySeasonalDiscount(trip.group_price, seasonalEvent), trip.currency)} {currency}{seasonalEvent && <small className="ml-2 rounded-full bg-[var(--primary-color)]/15 px-2 py-1 text-[9px] text-[var(--primary-color)]">-{seasonalEvent.discount}%</small>}</p><button type="button" onClick={() => purchased ? router.push(`/${locale}/trips/${trip.id}`) : setBookingTrip(trip)} className="rounded-full bg-[var(--primary-color)] px-4 py-2.5 text-xs font-semibold text-[#15120e] transition hover:-translate-y-0.5 hover:bg-[#ead39e]">{purchased ? t("Tripdetails") : t("btn")}</button></div></div>
      </motion.article>;
    })}
  </div>{bookingTrip && <WhatsAppBookingForm trip={bookingTrip} onClose={() => setBookingTrip(null)} />}</>;
}

function getLocalizedNames(items = [], language) {
  return items.filter(Boolean).map((item) => { let name = item.name; try { if (typeof name === "string" && name.startsWith("{")) name = JSON.parse(name); } catch { return item.name || ""; } return typeof name === "object" ? name?.[language] || name?.en || Object.values(name)[0] : name; }).filter(Boolean).join(", ");
}
