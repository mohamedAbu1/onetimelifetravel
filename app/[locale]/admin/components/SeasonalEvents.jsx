"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheck, FaSave, FaToggleOn } from "react-icons/fa";
import AdminModuleHeader from "./AdminModuleHeader";

const currentYear = new Date().getFullYear();
const annualEvents = new Set(["newYear", "womensDay", "mothersDay", "halloween"]);

export default function SeasonalEvents({ themeName = "dark" }) {
  const [events, setEvents] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [status, setStatus] = useState({ loading: true, saving: "", message: "" });

  useEffect(() => {
    fetch(`/api/seasonal-events?_=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setStatus({ loading: false, saving: "", message: "Unable to load seasonal settings." }))
      .finally(() => setStatus((value) => ({ ...value, loading: false })));
  }, []);

  const update = (key, patch) => setEvents((items) => items.map((event) => event.key === key ? { ...event, ...patch } : event));
  const save = async (event) => {
    setStatus({ loading: false, saving: event.key, message: "" });
    const response = await fetch("/api/seasonal-events", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event) });
    const data = await response.json();
    if (response.ok) {
      setEvents(data.events || events);
      try { localStorage.setItem("seasonal-events-settings", JSON.stringify(data.events || events)); } catch {}
      setStatus({ loading: false, saving: "", message: "Saved. Refresh the public website to apply the campaign." });
    } else setStatus({ loading: false, saving: "", message: data.error || "Unable to save settings." });
  };

  return <section className={`admin-module admin-module-seasonal ${themeName === "dark" ? "text-white" : ""} p-6`}>
    <AdminModuleHeader icon={FaCalendarAlt} eyebrow="Campaign / visual identity" title="Seasonal events" description="Control dates, activation and promotional discounts for every public seasonal design." actions={<span className="admin-metric-pill"><FaToggleOn /> {events.filter((event) => event.enabled).length} active</span>} />
    <div className="admin-seasonal-toolbar"><label>Editing year <input type="number" min="2020" max="2100" value={year} onChange={(e) => setYear(e.target.value)} /></label><span>{status.loading ? "Loading settings…" : status.message}</span></div>
    <div className="admin-seasonal-grid">{events.map((event) => {
      const annual = annualEvents.has(event.key);
      const dates = event.dates || {};
      const yearDates = dates[year] || ["", ""];
      return <article className={`admin-seasonal-card seasonal-${event.theme}`} key={event.key}>
        <div className="admin-seasonal-card-head"><div><span className="admin-seasonal-icon">{event.icon}</span><div><h3>{event.title?.en || event.key}</h3><small>{event.key}</small></div></div><button type="button" className={`admin-seasonal-toggle ${event.enabled ? "is-on" : ""}`} onClick={() => update(event.key, { enabled: !event.enabled })} aria-pressed={event.enabled}>{event.enabled ? "Enabled" : "Disabled"}</button></div>
        <div className="admin-seasonal-fields"><label>Discount %<input type="number" min="0" max="100" value={event.discount} onChange={(e) => update(event.key, { discount: e.target.value })} /></label>{annual ? <><label>Start (MM-DD)<input type="text" placeholder="01-01" value={event.annualStart || ""} onChange={(e) => update(event.key, { annualStart: e.target.value })} /></label><label>End (MM-DD)<input type="text" placeholder="01-07" value={event.annualEnd || ""} onChange={(e) => update(event.key, { annualEnd: e.target.value })} /></label></> : <><label>Start date<input type="date" value={yearDates[0] || ""} onChange={(e) => update(event.key, { dates: { ...dates, [year]: [e.target.value, yearDates[1] || ""] } })} /></label><label>End date<input type="date" value={yearDates[1] || ""} onChange={(e) => update(event.key, { dates: { ...dates, [year]: [yearDates[0] || "", e.target.value] } })} /></label></>}</div>
        <button type="button" className="admin-seasonal-save" onClick={() => save(event)} disabled={status.saving === event.key}><FaSave /> {status.saving === event.key ? "Saving…" : "Save event"}</button>
      </article>;
    })}</div>
    <p className="admin-seasonal-note"><FaCheck /> Annual events use MM-DD. Ramadan and Eid al-Fitr use exact dates per year.</p>
  </section>;
}
