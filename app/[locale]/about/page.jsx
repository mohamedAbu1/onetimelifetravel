"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";

// استدعاء الأقسام الجديدة
import AboutHero from "@/components/about/AboutHero";
import MissionValues from "@/components/about/MissionValues";
import StatsSection from "@/components/about/StatsSection";
import HeritageSection from "@/components/about/HeritageSection";
import CTASection from "@/components/about/CTASection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import Decor from "@/components/layout/Decor";
export default function AboutPage() {
  const { theme } = useTheme();
  const { user } = useAuth(); // ✅ جلب المستخدم الحالي
  return (
    <>
      <main className="site-page relative w-full flex flex-col min-h-screen justify-center items-center">
        {" "}
        <Decor pos={"top"} />
        <Header />
        <EgyptianBackground />
        {/* الأقسام */}
        <AboutHero />
              <Decor pos={"bottom"} />

        <MissionValues />
        <StatsSection />
        <HeritageSection />
        <CTASection />
        <Footer />
        <SignUpButton />
        <LoginModal />
        {user && <ChatWidget />}
        
      </main>
    </>
  );
}
