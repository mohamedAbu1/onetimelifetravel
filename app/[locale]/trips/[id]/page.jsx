"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { use, useEffect } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripItinerary from "./components/TripItinerary";
import TripInfo from "./components/TripInfo";
import TripReviews from "./components/TripReviews";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import CancelButton from "./components/CancelButton";
import { usePurchase } from "@/context/PurchaseContext";
import AccessibilityInfo from "./components/components/AccessibilityInfo";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TripExclusions from "./components/TripExclusions";
import CalendarWidget from "./components/CalendarWidget";
import { useMessages } from "@/context/MessageContext";
import PharaohState from "@/components/layout/PharaohState";
import PurchaseButton from "./components/PurchaseButton";

export default function TripPage({ params }) {
  const { id } = use(params);
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();
  const { t } = useTranslation("header");
  const { t: tc } = useTranslation("common");
  const { messages } = useMessages();

  useEffect(() => { if (!trips.length) fetchTrips(); }, [trips.length, fetchTrips]);
  const trip = getTripById(id);
  if (!trip) return <PharaohState kind="notFound" />;

  const hasActivePurchase = purchases.some((purchase) => purchase.trip_id === trip.id && purchase.user_id === userData?.id && purchase.status !== "Cancelled");

  return (
    <main className="site-page trip-world-page min-h-screen relative">
      <Header />
      <EgyptianBackground />
      <div className="trip-world-container relative z-10">
        <nav className="trip-world-breadcrumb" aria-label={tc("home")}><Link href={`/${lang}`}>{tc("home")}</Link><span>/</span><Link href={`/${lang}/trips`}>{tc("journeys")}</Link><span>/</span><strong>{trip.title?.[lang] || trip.title?.en}</strong></nav>
        <TripHeader trip={trip} lang={lang} />
        <div className="trip-world-facts"><div><span>𓏏</span><small>{tc("duration")}</small><b>{trip.duration} {trip.duration_unit?.[lang] || trip.duration_unit?.en || "days"}</b></div><div><span>𓉐</span><small>{tc("style")}</small><b>{tc("privateJourney")}</b></div><div><span>𓇼</span><small>{tc("region")}</small><b>{tc("nileEgypt")}</b></div><div><span>𓆣</span><small>{tc("travelPace")}</small><b>{tc("curated")}</b></div></div>
        <div className="trip-world-layout">
          <div className="trip-world-main">
            <section className="trip-world-section trip-world-overview"><div><p className="trip-world-label">{tc("theEdit")}</p><h2>{tc("everyDay")}</h2></div><p>{tc("journeyDescription")}</p></section>
            <div className="trip-world-two-col"><TripCities trip={trip} lang={lang} /><TripCategories trip={trip} lang={lang} /></div>
            <AccessibilityInfo theme={theme} themeName={theme} />
            <div className="trip-world-two-col"><TripIncludes trip={trip} lang={lang} theme={theme} themeName={theme} /><TripExclusions trip={trip} lang={lang} theme={theme} themeName={theme} /></div>
            <TripItinerary trip={trip} lang={lang} theme={theme} />
            <TripReviews trip={trip} lang={lang} theme={theme} />
            {userData && userData.role !== "ADMIN" && (hasActivePurchase ? <CancelButton trip={trip} theme={theme} /> : <Link href={`/${lang}/privacyPolicy`} className="trip-world-privacy">{t("PrivacyPolicy")}</Link>)}
          </div>
          <aside className="trip-world-aside"><div className="trip-world-sticky"><TripInfo trip={trip} lang={lang} /><PurchaseButton trip={trip} /><CalendarWidget trip={trip} id={id} /></div></aside>
        </div>
      </div>
      <Footer /><SignUpButton /><LoginModal />
      {userData && <ChatWidget />}
      {chatUser && <AdminChatWindow user={chatUser} admin={userData} messages={messages} onClose={() => setChatUser(null)} />}
    </main>
  );
}
