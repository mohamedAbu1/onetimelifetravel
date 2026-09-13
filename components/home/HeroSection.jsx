"use client";
import Background from "./components/Background";
import HeroText from "./components/HeroText";
import BookingForm from "./components/BookingForm";
import { useState } from "react";
import DownloadAppSection from "./components/DownloadAppSection";
import LeftSocialIcons from "./components/LeftSocialIcons";

export default function HeroSection() {
  const [showTrips, setShowTrips] = useState(false);
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-journal relative isolate flex min-h-[760px] w-full flex-col overflow-hidden lg:min-h-[820px]"
    >
      <div className="hero-journal-grid absolute inset-0" />
      <div className="hero-visual absolute right-0 top-0 h-[54%] w-full lg:h-full lg:w-[47%]"><Background /></div>
      <div className="hero-visual-wash absolute right-0 top-0 h-[54%] w-full lg:h-full lg:w-[47%]" />
      <div className="hero-ornament absolute left-[7%] top-[24%] hidden font-[Cinzel] text-7xl text-[var(--logo-border)]/20 lg:block">𓂀</div>

      <div className="relative z-20 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 px-5 pb-16 pt-[28rem] sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:gap-16 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="hero-copy flex flex-col items-center text-center lg:items-start lg:text-left">
          <HeroText />
          <div className="mt-9 grid w-full max-w-lg grid-cols-2 border-y border-[var(--logo-border)]/35 py-5 text-left text-[var(--text)]">
            <div className="border-r border-[var(--logo-border)]/35 pr-5"><strong className="block font-[Cinzel] text-2xl text-[var(--logo-border)]">01</strong><span className="text-xs uppercase tracking-[0.18em] opacity-70">Curated journeys</span></div>
            <div className="pl-5"><strong className="block font-[Cinzel] text-2xl text-[var(--logo-border)]">∞</strong><span className="text-xs uppercase tracking-[0.18em] opacity-70">Timeless memories</span></div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-4 lg:items-end">
          <p className="w-full max-w-[560px] text-xs font-bold uppercase tracking-[0.28em] text-[var(--logo-border)]">Design your Egyptian story</p>
          <BookingForm setShowTrips={setShowTrips} />
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--text)]/55 lg:flex">
        <span className="h-px w-10 bg-[var(--logo-border)]" /> Scroll to explore <span className="h-px w-10 bg-[var(--logo-border)]" />
      </div>

      <div className="relative z-20 w-full lg:hidden">
        <DownloadAppSection />
      </div>
      <LeftSocialIcons />
    </section>
  );
}
