"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import HeroSection from "@/components/home/HeroSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext"; // ✅ استدعاء الـ Auth
import CurrencySelector from "@/components/layout/CurrencySelector";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import { useMessages } from "@/context/MessageContext";
import dynamic from "next/dynamic";
// import { useQueryFilters } from "@/context/QueryContext";

const SectionLoading = () => <div className="min-h-[320px] w-full bg-[var(--background)]" aria-hidden="true" />;
const CategoriesSection = dynamic(() => import("@/components/home/CategoriesSection"), { loading: SectionLoading });
const TopTripsSection = dynamic(() => import("@/components/home/TopTripsSection"), { loading: SectionLoading });
const CitiesSection = dynamic(() => import("@/components/home/CitiesSection"), { loading: SectionLoading });
const OurSection = dynamic(() => import("@/components/home/OurSection"), { loading: SectionLoading });
const TopReviewsSection = dynamic(() => import("@/components/home/components/TopReviewsSection"), { loading: SectionLoading });
const CarBookingSection = dynamic(() => import("@/components/home/CarBookingSection"), { loading: SectionLoading });
export default function Home() {
  const { userData, chatUser, setChatUser } = useAuth();
  const { messages } = useMessages();

  return (
    <>
      <Header />

      <main
        className={`
        w-full
        flex
        flex-col
        items-center
        justify-center
        min-h-screen font-sans
     
        transition-colors duration-300
        overflow-hidden
        
      `}
      >
        {/* ================= HERO SECTION ================= */}
        <HeroSection />
        {/* ================= CATEGORIES SECTION ================= */}
        <CategoriesSection />

        {/* ================= TOP TRIPS SECTION ================= */}
        <TopTripsSection />

        {/* ================= CITIES SECTION ================= */}
        <CitiesSection />

        <OurSection />
        <TopReviewsSection />

        <CarBookingSection />

        {/* ================= FOOTER ================= */}
        <Footer />

        <SignUpButton />
        <LoginModal />

        {/* نافذة الدردشة تظهر فقط لو المستخدم مسجل دخول */}
         {userData && <ChatWidget />}

        <CurrencySelector />
        {chatUser && (
          <AdminChatWindow
            user={chatUser}
            admin={userData}
            messages={messages}
            onClose={() => setChatUser(null)}
          />
        )}
        <ScrollToTopButton />
      </main>
    </>
  );
}
