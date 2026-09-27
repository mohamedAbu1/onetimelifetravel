"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Logo from "@/components/header/components/Logo";

const STORAGE_KEY = "otl-cinematic-welcome-seen";

export default function CinematicWelcome() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) === "true") setVisible(false);
  }, []);

  const enterSite = () => {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] overflow-hidden bg-[#071216] text-[#f8f1e3]"
          aria-label="Welcome to One Time Life Travel"
        >
          <Image
            src="/HomePageImage/banner-optimized.webp"
            alt="Egyptian landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,56,62,.2),rgba(3,11,14,.94)_78%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(5,17,21,.9),transparent_48%,rgba(5,17,21,.8))]" />
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10"
          >
            <div className="relative w-full max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="mb-8 flex justify-center"
              >
                <div className="rounded-3xl border border-[#d8b66b]/35 bg-black/20 px-7 py-4 shadow-[0_0_55px_rgba(216,182,107,.12)] backdrop-blur-md">
                  <Logo compact />
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.7em" }}
                animate={{ opacity: 1, letterSpacing: "0.34em" }}
                transition={{ delay: 0.65, duration: 1 }}
                className="text-[10px] font-bold uppercase text-[#d8b66b] sm:text-xs"
              >
                A different way to discover Egypt
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 1 }}
                className="mt-6 font-[Cinzel] text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#f8f1e3] sm:text-6xl md:text-7xl"
              >
                Welcome to your
                <span className="block text-[#d8b66b]">next story.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.9 }}
                className="mx-auto mt-8 max-w-xl border-y border-[#d8b66b]/30 py-5 text-sm leading-7 text-[#d4c8b4] sm:text-base"
              >
                <p>Crafted journeys. Timeless places. The Egypt you will remember forever.</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.18em] text-[#d8b66b]">
                  <span>Mohamed Abu</span>
                  <span className="text-[#d8b66b]/45">•</span>
                  <span>Omran Ahmed <em className="not-italic text-[#d4c8b4]">— Owner</em></span>
                </div>
              </motion.div>

              <motion.button
                type="button"
                onClick={enterSite}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.45, duration: 0.8 }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 35px rgba(216,182,107,.28)" }}
                whileTap={{ scale: 0.98 }}
                className="mt-9 rounded-full border border-[#d8b66b] bg-[#d8b66b] px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-[#101819] transition"
              >
                Enter the Journey
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="mt-8 flex items-center justify-center gap-4 text-xl text-[#d8b66b]/55"
                aria-hidden="true"
              >
                <span>𓂀</span><span className="h-px w-14 bg-[#d8b66b]/35" /><span>𓋹</span><span className="h-px w-14 bg-[#d8b66b]/35" /><span>𓇼</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
