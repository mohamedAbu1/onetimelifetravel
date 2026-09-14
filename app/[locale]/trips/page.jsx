"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import CurrencySelector from "../../../components/layout/CurrencySelector";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import TripsFilter from "@/components/trips/TripsFilter";
import TripsSearch from "@/components/trips/TripsSearch";
import TripsGrid from "@/components/trips/TripsGrid";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useQueryFilters } from "@/context/QueryContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useMessages } from "@/context/MessageContext";
import { useTranslation } from "react-i18next";

export default function TripsPage() {
  const { trips = [], fetchTrips, loadingTrips } = useTrip();
  const { cities: allCities = [], categories: allCategories = [], loading } = useCitiesCategories();
  const { lang } = useLanguage();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases = [] } = usePurchase();
  const { messages } = useMessages();
  const { t } = useTranslation("common");
  const { city, category, group_price: price, popular } = useQueryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");
  const [search, setSearch] = useState("");
  const tripsPerPage = cardStyle === "vertical" ? 9 : 8;

  useEffect(() => { fetchTrips(); }, []);
  useEffect(() => { setCurrentPage(1); }, [search, city, category, price, popular, cardStyle]);

  const filteredTrips = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const ranges = { Economy: [0, 199], Standard: [200, 599], Luxury: [600, Infinity] };
    return trips.filter((trip) => {
      const title = trip.title?.[lang] || trip.title?.en || "";
      const cityNames = getLocalizedNames(trip.cities, lang);
      const categoryNames = getLocalizedNames(trip.categories, lang);
      const matchesSearch = !normalizedSearch || title.toLowerCase().includes(normalizedSearch);
      const matchesCity = city === "all" || !city || (Array.isArray(city) ? city.some((value) => cityNames.some((name) => name.toLowerCase() === value.toLowerCase())) : cityNames.some((name) => name.toLowerCase() === city.toLowerCase()));
      const matchesCategory = category === "all" || !category || (Array.isArray(category) ? category.some((value) => categoryNames.some((name) => name.toLowerCase() === value.toLowerCase())) : categoryNames.some((name) => name.toLowerCase() === category.toLowerCase()));
      const range = ranges[price];
      const matchesPrice = !range || price === "All" || (Number(trip.group_price) >= range[0] && Number(trip.group_price) <= range[1]);
      return matchesSearch && matchesCity && matchesCategory && matchesPrice;
    }).map((trip) => ({ ...trip, purchase_count: purchases.filter((purchase) => purchase.trip_id?.toString() === trip.id?.toString()).length }));
  }, [trips, search, city, category, price, lang, purchases]);

  const finalTrips = useMemo(() => popular ? [...filteredTrips].sort((a, b) => b.purchase_count - a.purchase_count) : filteredTrips, [filteredTrips, popular]);
  const totalPages = Math.ceil(finalTrips.length / tripsPerPage);
  const currentTrips = finalTrips.slice((currentPage - 1) * tripsPerPage, currentPage * tripsPerPage);

  return <main className="site-page relative min-h-screen overflow-hidden bg-[#0d0d0d] text-[#f4ead8]">
    <EgyptianBackground />
    <Header />
    <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-32 md:px-8 lg:px-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10 max-w-3xl">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#d1b06a]">{t("curatedJourneys")}</p>
        <h1 className="font-[Cinzel] text-4xl font-semibold leading-tight text-[#f4ead8] md:text-6xl">{t("exploreNextStory")}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#aaa092] md:text-base">{t("choosePace")}</p>
      </motion.div>
      <div className="mb-6 rounded-[1.5rem] border border-[#d1b06a]/20 bg-[#d1b06a]/[0.06] px-5 py-4 text-sm text-[#c5b9a7]"><span className="font-semibold text-[#ead39e]">{finalTrips.length}</span> {t("journeysReady")}</div>
      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <TripsFilter allCities={allCities} allCategories={allCategories} loading={loading} />
        <div className="min-w-0 space-y-6">
          <TripsSearch search={search} setSearch={setSearch} cardStyle={cardStyle} setCardStyle={setCardStyle} resultCount={finalTrips.length} />
          {loadingTrips ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-[430px] animate-pulse rounded-[1.5rem] bg-white/10" />)}</div> : currentTrips.length ? <TripsGrid trips={currentTrips} cardStyle={cardStyle} /> : <div className="rounded-[1.5rem] border border-[var(--border)] bg-[#151515] px-6 py-20 text-center"><p className="text-4xl">𓂀</p><h2 className="mt-4 font-[Cinzel] text-2xl">{t("noJourneys")}</h2><p className="mt-3 text-sm text-[#9c9385]">{t("tryAnotherSearch")}</p></div>}
          {totalPages > 1 && <nav aria-label="Trips pagination" className="flex justify-center gap-2 pt-2">{Array.from({ length: totalPages }, (_, index) => <button type="button" key={index} onClick={() => { setCurrentPage(index + 1); window.scrollTo({ top: 120, behavior: "smooth" }); }} className={`h-10 min-w-10 rounded-full border px-3 text-sm transition ${currentPage === index + 1 ? "border-[#d1b06a] bg-[#d1b06a] text-[#15120e]" : "border-white/10 bg-[#151515] text-[#aaa092] hover:border-[#d1b06a]/60"}`}>{index + 1}</button>)}</nav>}
        </div>
      </div>
    </section>
    <Footer /><SignUpButton /><LoginModal />{userData && <ChatWidget />}{chatUser && <AdminChatWindow user={chatUser} admin={userData} messages={messages} onClose={() => setChatUser(null)} />}<CurrencySelector />
  </main>;
}

function getLocalizedNames(items = [], language) {
  return items.filter(Boolean).map((item) => { let name = item.name; try { if (typeof name === "string" && name.startsWith("{")) name = JSON.parse(name); } catch { return item.name || ""; } return typeof name === "object" ? name?.[language] || name?.en || Object.values(name)[0] : name; }).filter(Boolean);
}
