"use client";

import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { applySeasonalDiscount } from "@/lib/seasonalEvents";
import { useSeasonalEvent } from "@/components/layout/useSeasonalEvent";
import { DEFAULT_IMAGE } from "@/lib/imageUrl";
import { getTripCardImages } from "@/lib/tripCardImage";
import WhatsAppBookingForm from "@/components/trips/WhatsAppBookingForm";

function TripCardImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(src || DEFAULT_IMAGE);

  useEffect(() => {
    setImageSrc(src || DEFAULT_IMAGE);
  }, [src]);

  return <img src={imageSrc} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} loading="lazy" decoding="async" onError={() => setImageSrc(DEFAULT_IMAGE)} />;
}

export default function TripsGrid({ trips = [], cardStyle = "vertical" }) {
  const { currency } = usePurchase();
  const { rates } = useCurrency();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const seasonalEvent = useSeasonalEvent();
  const [bookingTrip, setBookingTrip] = useState(null);
  const cardImages = getTripCardImages(trips);

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
      const image = cardImages[index] || DEFAULT_IMAGE;
      return <motion.article key={trip.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }} className={`group overflow-hidden rounded-[1.5rem] border border-[var(--card-border)]/70 bg-[var(--card-bg)] shadow-[0_18px_50px_rgba(0,0,0,.16)] ${cardStyle === "horizontal" ? "md:flex" : ""}`}>
        <div className={`relative overflow-hidden ${cardStyle === "horizontal" ? "h-64 md:h-auto md:w-2/5" : "h-60"}`}><TripCardImage src={image} alt={title} className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ead39e] backdrop-blur-md">{trip.duration || "Egypt journey"}</div></div>
        <div className="flex flex-1 flex-col justify-between p-5"><div><div className="mb-3 flex items-center justify-between gap-2"><span className="text-xs text-[var(--primary-color)]">{cities || "Egypt"}</span><span className="flex items-center gap-1 text-xs text-[var(--primary-color)]"><FaStar /> {trip.rating || "4.5"}</span></div><h2 className="line-clamp-2 font-[Cinzel] text-xl font-semibold leading-snug text-[var(--heading)]">{title}</h2><p className="mt-3 line-clamp-1 text-xs text-[var(--sub-text)]">{categories || t("NoCategory")}</p></div><div className="mt-6 flex items-center justify-between gap-3"><p className="text-lg font-semibold text-[var(--primary-color)]">{convertPrice(applySeasonalDiscount(trip.group_price, seasonalEvent), trip.currency)} {currency}{seasonalEvent && <small className="ml-2 rounded-full bg-[var(--primary-color)]/15 px-2 py-1 text-[9px] text-[var(--primary-color)]">-{seasonalEvent.discount}%</small>}</p><button type="button" onClick={() => setBookingTrip(trip)} className="rounded-full bg-[var(--primary-color)] px-4 py-2.5 text-xs font-semibold text-[#15120e] transition hover:-translate-y-0.5 hover:bg-[#ead39e]">{t("btn")}</button></div></div>
      </motion.article>;
    })}
  </div>{bookingTrip && <WhatsAppBookingForm trip={bookingTrip} onClose={() => setBookingTrip(null)} />}</>;
}

function getLocalizedNames(items = [], language) {
  return items.filter(Boolean).map((item) => { let name = item.name; try { if (typeof name === "string" && name.startsWith("{")) name = JSON.parse(name); } catch { return item.name || ""; } return typeof name === "object" ? name?.[language] || name?.en || Object.values(name)[0] : name; }).filter(Boolean).join(", ");
}
