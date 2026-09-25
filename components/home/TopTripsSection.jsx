"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "@/context/TripContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { applySeasonalDiscount } from "@/lib/seasonalEvents";
import { useSeasonalEvent } from "@/components/layout/useSeasonalEvent";

export default function TopTripsSection() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: tc } = useTranslation("common");
  const { trips, fetchTrips, loadingTrips, error } = useTrip();
  const { currency, purchases = [] } = usePurchase();
  const { rates } = useCurrency();
  const seasonalEvent = useSeasonalEvent();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const language = i18n.language.split("-")[0];

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  if (loadingTrips) {
    return <section className="site-section w-full px-6 py-20" aria-label={tc("loading")}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-[430px] animate-pulse rounded-[1.75rem] border border-[var(--logo-border)]/20 bg-[var(--card-bg)]" />)}</div></section>;
  }

  const topTrips = [...(trips || [])].sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)).slice(0, 6);
  const convertPrice = (price, tripCurrency) => {
    const amount = Number(price) || 0;
    if (currency === tripCurrency) return amount.toFixed(2);
    if (currency === "EUR" && tripCurrency === "USD") return (amount * (rates.EUR || 0.85)).toFixed(2);
    if (currency === "USD" && tripCurrency === "EUR") return (amount / (rates.EUR || 1.18)).toFixed(2);
    if (currency === "EGP" && tripCurrency === "USD") return (amount * (rates.USD || 49.1)).toFixed(2);
    if (currency === "USD" && tripCurrency === "EGP") return (amount / (rates.USD || 49.1)).toFixed(2);
    return amount.toFixed(2);
  };

  if (!topTrips.length) {
    return <section id="featured-trips" className="site-section w-full px-6 py-20 text-center">{error ? <><p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--primary-color)]">{tc("featuredJourneys")}</p><h2 className="mt-4 font-[Cinzel] text-3xl text-[var(--heading)]">{tc("dataUnavailable", { defaultValue: "Journeys are temporarily unavailable" })}</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{tc("tryAgainLater", { defaultValue: "Please try again in a moment." })}</p><button type="button" onClick={fetchTrips} className="mt-5 rounded-full bg-[var(--primary-color)] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-[#15120e]">{tc("retry", { defaultValue: "Try again" })}</button></> : <><p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--primary-color)]">{tc("featuredJourneys")}</p><h2 className="mt-4 font-[Cinzel] text-3xl text-[var(--heading)]">{tc("nextStory")}</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--sub-text)]">{tc("preparingJourneys")}</p></>}</section>;
  }

  return (
    <section id="featured-trips" className={`site-section w-full overflow-hidden px-5 py-20 md:px-8 lg:px-12 ${theme.background}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--primary-color)]">One Time Life Travel · {tc("curatedJourneys")}</p><h2 className="font-[Cinzel] text-3xl font-semibold text-[var(--heading)] md:text-5xl">{t("TopTrips")}</h2></div><p className="max-w-md text-sm leading-7 text-[var(--sub-text)] md:text-right">{tc("reviewsCopy")}</p></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {topTrips.map((trip, index) => {
            const title = trip.title?.[language] || trip.title?.en || "Untitled trip";
            const reviewCount = Array.isArray(trip.reviews) ? trip.reviews.length : 0;
            const hasPurchased = purchases.some((purchase) => purchase.trip_id === trip.id && purchase.user_id === user?.id && purchase.status !== "Cancelled");
            return <motion.article key={trip.id || index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.3) }} className="group overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--card-bg)] shadow-[0_18px_50px_rgba(0,0,0,.2)]">
              <div className="relative h-64 overflow-hidden"><Image src={trip.cover_image || "/default.jpg"} alt={title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /><div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ead39e] backdrop-blur-md">{tc("featured")}</div><div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-[#f4ead8]"><span>{trip.duration || tc("curated")}</span><span className="rounded-full bg-black/45 px-3 py-1 backdrop-blur-md">★ {trip.rating || "4.5"}</span></div></div>
              <div className="flex min-h-[205px] flex-col justify-between p-5"><div><h3 className="line-clamp-2 font-[Cinzel] text-xl font-semibold leading-snug text-[var(--heading)]">{title}</h3><p className="mt-3 text-xs text-[var(--sub-text)]">{reviewCount} {t("reviews")}</p></div><div className="mt-6 flex items-center justify-between gap-3"><p className="text-lg font-semibold text-[var(--primary-color)]">{convertPrice(applySeasonalDiscount(trip.group_price, seasonalEvent), trip.currency)} {currency}{seasonalEvent && <small className="ml-2 text-[9px] text-[var(--primary-color)]">-{seasonalEvent.discount}%</small>}</p><button type="button" onClick={() => router.push(`/${locale}/trips/${trip.id}`)} className={`rounded-full px-4 py-2.5 text-xs font-semibold transition hover:-translate-y-0.5 ${theme.buttonPrimary}`}>{hasPurchased ? t("Tripdetails") : t("BookNow")}</button></div></div>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
