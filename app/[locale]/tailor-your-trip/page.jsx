"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaBed, FaCalendarAlt, FaCheck, FaCompass, FaUsers, FaWhatsapp } from "react-icons/fa";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import { useAuth } from "@/context/AuthContext";

const destinations = ["Luxor", "Aswan", "Cairo", "Abu Simbel", "Nile cruise"];
const durations = ["2–3 days", "4–6 days", "7–10 days", "10+ days"];
const travelStyles = ["Ancient temples", "Nile moments", "Local food", "Desert adventure", "Family time", "Slow travel"];

const initialForm = {
  destinations: [],
  duration: "4–6 days",
  styles: [],
  travelers: "2 travelers",
  date: "",
  stay: "Boutique hotels",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

export default function TailorYourTripPage() {
  const { user, userData } = useAuth();
  const [form, setForm] = useState({ ...initialForm, name: userData?.name || user?.user_metadata?.name || "", email: user?.email || "" });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const toggle = (field, value) => setForm((current) => ({
    ...current,
    [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value],
  }));

  const summaryStyles = useMemo(() => form.styles.length ? form.styles.join(", ") : "Your travel style", [form.styles]);
  const summaryDestinations = useMemo(() => form.destinations.length ? form.destinations.join(", ") : "Choose your destinations", [form.destinations]);

  const submit = (event) => {
    event.preventDefault();
    const message = [
      "Hello One Time Life Travel, I would like to tailor my Egypt journey.",
      `Name: ${form.name}`,
      `WhatsApp: ${form.phone}`,
      form.email ? `Email: ${form.email}` : "",
      `Destinations: ${summaryDestinations}`,
      `Duration: ${form.duration}`,
      `Travel style: ${summaryStyles}`,
      `Travelers: ${form.travelers}`,
      form.date ? `Preferred date: ${form.date}` : "",
      `Stay preference: ${form.stay}`,
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/201018539889?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="site-page relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text)]">
      <Header />
      <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(194,168,120,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(194,168,120,.12)_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[var(--logo-border)]/10 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8 }}>
            <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.32em] text-[var(--logo-border)]"><span className="h-px w-10 bg-[var(--logo-border)]" /> Your Egypt, your rhythm</p>
            <h1 className="max-w-3xl font-[Cinzel] text-5xl font-semibold leading-[1.05] tracking-[-.04em] text-[var(--heading)] sm:text-7xl">Tailor your trip.<span className="block text-[var(--primary-color)]">Make it yours.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[var(--sub-text)] sm:text-lg">Build a journey around the places, pace, and experiences you care about. Tell us what you imagine and our local team will shape the details with you.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--sub-text)]"><span className="rounded-full border border-[var(--card-border)] px-3 py-2">Local experts</span><span className="rounded-full border border-[var(--card-border)] px-3 py-2">Flexible planning</span><span className="rounded-full border border-[var(--card-border)] px-3 py-2">Made for you</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative min-h-[300px] overflow-hidden rounded-[2rem] border border-[var(--logo-border)]/35 bg-black/30 shadow-2xl lg:min-h-[380px]">
            <div className="absolute inset-0 bg-[url('/HomePageImage/banner-optimized.webp')] bg-cover bg-center opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071216] via-[#071216]/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[var(--logo-border)]">One Time Life Travel</p><p className="mt-2 max-w-xs font-[Cinzel] text-2xl text-[var(--heading)]">A journey with intention.</p></div><span className="text-5xl text-[var(--logo-border)]/60">𓂀</span></div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-start">
          <form onSubmit={submit} className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card-bg)]/80 p-5 shadow-[0_24px_80px_rgba(0,0,0,.16)] backdrop-blur-xl sm:p-8">
            <div className="mb-10"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[var(--logo-border)]">01 · The essentials</p><h2 className="mt-3 font-[Cinzel] text-3xl text-[var(--heading)]">Where would you like to go?</h2><DividerWithIcon /></div>
            <div className="flex flex-wrap gap-2">{destinations.map((item) => <button key={item} type="button" onClick={() => toggle("destinations", item)} className={`rounded-full border px-4 py-2.5 text-sm transition ${form.destinations.includes(item) ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-[#141714]" : "border-[var(--card-border)] text-[var(--sub-text)] hover:border-[var(--primary-color)]"}`}>{form.destinations.includes(item) && <FaCheck className="mr-2 inline text-xs" />}{item}</button>)}</div>
            <div className="mt-8"><p className="mb-3 text-sm font-semibold text-[var(--sub-text)]">How long would you like to travel?</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{durations.map((item) => <button key={item} type="button" onClick={() => update("duration", item)} className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${form.duration === item ? "border-[var(--primary-color)] bg-[var(--primary-color)]/15 text-[var(--heading)]" : "border-[var(--card-border)] text-[var(--sub-text)] hover:border-[var(--primary-color)]"}`}>{item}</button>)}</div></div>

            <div className="mb-10 mt-14"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[var(--logo-border)]">02 · Your style</p><h2 className="mt-3 font-[Cinzel] text-3xl text-[var(--heading)]">What should the journey feel like?</h2><p className="mt-2 text-sm text-[var(--sub-text)]">Choose as many as you like. There is no wrong answer.</p><div className="mt-5 flex flex-wrap gap-2">{travelStyles.map((item) => <button key={item} type="button" onClick={() => toggle("styles", item)} className={`rounded-full border px-4 py-2.5 text-sm transition ${form.styles.includes(item) ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-[#141714]" : "border-[var(--card-border)] text-[var(--sub-text)] hover:border-[var(--primary-color)]"}`}>{form.styles.includes(item) && <FaCheck className="mr-2 inline text-xs" />}{item}</button>)}</div></div>

            <div className="grid gap-4 border-t border-[var(--card-border)]/60 pt-6 sm:grid-cols-3"><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)]"><span className="flex items-center gap-2"><FaUsers className="text-[var(--primary-color)]" /> Travelers</span><select value={form.travelers} onChange={(event) => update("travelers", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]">{[1, 2, 3, 4, 5, 6, 7, 8, "9+"] .map((count) => <option key={count}>{count} {count === 1 ? "traveler" : "travelers"}</option>)}</select></label><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)]"><span className="flex items-center gap-2"><FaCalendarAlt className="text-[var(--primary-color)]" /> Preferred date</span><input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)]"><span className="flex items-center gap-2"><FaBed className="text-[var(--primary-color)]" /> Stay preference</span><select value={form.stay} onChange={(event) => update("stay", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]"><option>Boutique hotels</option><option>Comfort hotels</option><option>Luxury stays</option><option>Mix of stays</option></select></label></div>

            <div className="mb-10 mt-14"><p className="text-[10px] font-bold uppercase tracking-[.28em] text-[var(--logo-border)]">03 · Make it personal</p><h2 className="mt-3 font-[Cinzel] text-3xl text-[var(--heading)]">Where can we reach you?</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)]">Full name *<input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)]">WhatsApp number *<input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Your WhatsApp number" className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)] sm:col-span-2">Email <span className="font-normal opacity-60">(optional)</span><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-2 text-xs font-semibold text-[var(--sub-text)] sm:col-span-2">Anything else we should know?<textarea rows="4" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Tell us about a special moment, preference, or request..." className="resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label></div></div>

            <button type="submit" className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--primary-color)] px-6 py-4 text-sm font-black uppercase tracking-[.14em] text-[#141714] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(194,168,120,.22)]"><FaWhatsapp /> Send my trip request <FaArrowRight className="text-xs" /></button><p className="mt-4 text-center text-xs text-[var(--sub-text)]">No payment or commitment. We will refine the details with you first.</p>
          </form>

          <aside className="lg:sticky lg:top-28"><div className="rounded-[2rem] border border-[var(--logo-border)]/45 bg-[linear-gradient(145deg,rgba(194,168,120,.13),rgba(255,255,255,.025))] p-6 shadow-[0_24px_70px_rgba(0,0,0,.16)] sm:p-8"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.28em] text-[var(--logo-border)]">Your trip brief</span><FaCompass className="text-xl text-[var(--primary-color)]" /></div><h2 className="mt-4 font-[Cinzel] text-3xl leading-tight text-[var(--heading)]">A journey with intention.</h2><div className="mt-8 space-y-5 border-t border-[var(--card-border)]/60 pt-6"><div><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--logo-border)]">Destinations</span><p className="mt-1 text-sm text-[var(--text)]">{summaryDestinations}</p></div><div><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--logo-border)]">Pace</span><p className="mt-1 text-sm text-[var(--text)]">{form.duration}</p></div><div><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--logo-border)]">Travel style</span><p className="mt-1 text-sm text-[var(--text)]">{summaryStyles}</p></div><div><span className="text-[10px] font-bold uppercase tracking-[.2em] text-[var(--logo-border)]">Stay</span><p className="mt-1 text-sm text-[var(--text)]">{form.stay}</p></div></div></div><div className="mt-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/60 p-5 text-sm leading-7 text-[var(--sub-text)]"><p className="font-semibold text-[var(--heading)]">How it works</p><ol className="mt-3 space-y-3"><li><span className="mr-2 text-[var(--primary-color)]">01</span> Share your travel wish list.</li><li><span className="mr-2 text-[var(--primary-color)]">02</span> We refine the route with local insight.</li><li><span className="mr-2 text-[var(--primary-color)]">03</span> Receive a personal plan on WhatsApp.</li></ol></div></aside>
        </div>
      </section>
      <Footer />
      <SignUpButton />
      <LoginModal />
      {user && <ChatWidget />}
    </main>
  );
}
