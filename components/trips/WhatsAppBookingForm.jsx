"use client";

import { useState } from "react";

export default function WhatsAppBookingForm({ trip, initialTravelers = "1", initialDate = "", onClose }) {
  const title = trip?.title?.en || trip?.title?.ar || "Egyptian journey";
  const [form, setForm] = useState({ name: "", phone: "", travelers: String(initialTravelers || 1), date: initialDate || "", notes: "" });

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    const message = [
      "Hello One Time Life Travel, I would like to book:",
      `Trip: ${title}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Travelers: ${form.travelers}`,
      form.date ? `Preferred date: ${form.date}` : "",
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/201009011178?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    onClose();
  };

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="WhatsApp booking form" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form onSubmit={submit} className="w-full max-w-lg rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-[var(--text)] shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--primary-color)]">Book via WhatsApp</p><h2 className="mt-2 font-[Cinzel] text-2xl text-[var(--heading)]">{title}</h2></div><button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-xl text-[var(--sub-text)] hover:bg-[var(--primary-color)]/10" aria-label="Close">×</button></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Full name<input required value={form.name} onChange={(event) => update("name", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Phone / WhatsApp<input required value={form.phone} onChange={(event) => update("phone", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Travelers<input required min="1" type="number" value={form.travelers} onChange={(event) => update("travelers", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label><label className="grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Preferred date<input type="date" value={form.date} onChange={(event) => update("date", event.target.value)} className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label></div>
      <label className="mt-4 grid gap-1.5 text-xs font-semibold text-[var(--sub-text)]">Notes<textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows="3" className="resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-3 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary-color)]" /></label>
      <button type="submit" className="mt-5 w-full rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1ebe5d]">Continue to WhatsApp</button>
    </form>
  </div>;
}
