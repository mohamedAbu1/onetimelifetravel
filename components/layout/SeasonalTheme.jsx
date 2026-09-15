"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { configureSeasonalEvents, getActiveSeasonalEvent, getSeasonalEventByKey, getSeasonalEvents } from "@/lib/seasonalEvents";

export default function SeasonalTheme() {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (pathname.includes("/admin")) {
      setEvent(null);
      setPreviewMode(false);
      delete document.documentElement.dataset.season;
      return undefined;
    }
    let cancelled = false;
    const apply = (settings, activePayload = null) => {
      if (settings) {
        configureSeasonalEvents(settings);
        try { window.localStorage.setItem("seasonal-events-settings", JSON.stringify(settings)); } catch {}
      }
      if (cancelled) return;
      const previewKey = new URLSearchParams(window.location.search).get("seasonPreview");
      const previewEvent = previewKey && previewKey !== "picker" ? getSeasonalEventByKey(previewKey) : null;
      const apiEvent = activePayload?.event?.key ? getSeasonalEventByKey(activePayload.event.key) : null;
      const active = previewEvent || apiEvent || getActiveSeasonalEvent();
      setEvent(active);
      setPreviewMode(Boolean(previewEvent || previewKey === "picker"));
      document.documentElement.dataset.season = active?.theme || "default";
      window.dispatchEvent(new Event("seasonal-theme-change"));
    };
    try {
      const cached = window.localStorage.getItem("seasonal-events-settings");
      if (cached) apply(JSON.parse(cached)); else apply(null);
    } catch { apply(null); }
    fetch(`/api/seasonal-events?_=${Date.now()}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => fetch(`/api/seasonal-events/active?_=${Date.now()}`, { cache: "no-store" }).then((response) => response.json()).then((activeData) => apply(data.events, activeData)))
      .catch(() => {});
    return () => { cancelled = true; delete document.documentElement.dataset.season; };
  }, [pathname]);

  if ((!event && !previewMode) || pathname.includes("/admin")) return null;
  const language = i18n.language?.startsWith("ar") ? "ar" : "en";
  const previewEvents = getSeasonalEvents();

  if (!event) return <nav className="seasonal-preview-picker" aria-label="Seasonal design previews">{previewEvents.map((item) => <a key={item.key} href={`?seasonPreview=${item.key}`} className={`seasonal-preview-link seasonal-${item.theme}`}>{item.icon} {item.title[language]}</a>)}</nav>;

  return <><div className={`seasonal-banner seasonal-${event.theme}`} role="status"><span className="seasonal-banner-icon">{event.icon}</span><span><strong>{event.title[language]}</strong><small>{event.copy[language]}</small></span><b>{event.discount}% OFF</b></div>{previewMode && <a className="seasonal-preview-reset" href={pathname}>Live date</a>}</>;
}
