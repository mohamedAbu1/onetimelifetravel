"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
import OurSection from "@/components/home/OurSection";
import TopTripsSection from "@/components/home/TopTripsSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import TopReviewsSection from "@/components/home/components/TopReviewsSection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext"; // ✅ استدعاء الـ Auth
import CurrencySelector from "@/components/layout/CurrencySelector";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import { useMessages } from "@/context/MessageContext";
// import { useQueryFilters } from "@/context/QueryContext";
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
