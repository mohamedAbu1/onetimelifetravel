const ramadanDates = {
  2026: ["2026-02-18", "2026-03-19"],
  2027: ["2027-02-08", "2027-03-08"],
  2028: ["2028-01-27", "2028-02-25"],
};

const eidDates = {
  2026: ["2026-03-20", "2026-03-23"],
  2027: ["2027-03-09", "2027-03-12"],
  2028: ["2028-02-26", "2028-02-29"],
};

const events = [
  { key: "newYear", start: (year) => `${year}-01-01`, end: (year) => `${year}-01-07`, discount: 15, icon: "✦", theme: "midnight", symbols: ["✦", "✧", "·", "⟡"], heroImage: "/HomePageImage/banner.62f1bfcb.jpg", title: { en: "New Year escape", ar: "احتفال رأس السنة" }, copy: { en: "Start the year with a story worth remembering.", ar: "ابدأ العام برحلة تستحق أن تُروى." }, campaign: { en: "A new chapter, written in Egypt.", ar: "فصل جديد تكتبه في مصر." } },
  { key: "womensDay", start: (year) => `${year}-03-08`, end: (year) => `${year}-03-10`, discount: 12, icon: "✿", theme: "rose", symbols: ["✿", "❀", "♡", "·"], heroImage: "/HomePageImage/pexels-tima-miroshnichenko-6010456.webp", title: { en: "Women’s Day journeys", ar: "رحلات عيد المرأة" }, copy: { en: "A celebration of courage, discovery and unforgettable places.", ar: "احتفال بالشجاعة والاكتشاف والأماكن التي لا تُنسى." }, campaign: { en: "Travel boldly. Leave beautifully.", ar: "سافري بشجاعة واتركي أثرًا جميلًا." } },
  { key: "mothersDay", start: (year) => `${year}-03-21`, end: (year) => `${year}-03-24`, discount: 12, icon: "♡", theme: "blossom", symbols: ["♡", "❀", "✿", "⌁"], heroImage: "/HomePageImage/pexels-taryn-elliott-4405249.webp", title: { en: "Mother’s Day memories", ar: "ذكريات عيد الأم" }, copy: { en: "Give her time together, wrapped in the beauty of Egypt.", ar: "امنحها وقتًا مشتركًا وسط جمال مصر." }, campaign: { en: "The most beautiful gift is time together.", ar: "أجمل هدية هي الوقت الذي نقضيه معًا." } },
  { key: "ramadan", getDates: (year) => ramadanDates[year], discount: 18, icon: "☾", theme: "lantern", symbols: ["☾", "✦", "◈", "⌁"], heroImage: "/HomePageImage/magnific__3d-egyptian-temple-desktop-background-nile-river-p__61913.webp", title: { en: "Ramadan nights in Egypt", ar: "ليالي رمضان في مصر" }, copy: { en: "Slow down, gather close and discover Egypt after sunset.", ar: "استمتع بالهدوء واكتشف مصر بعد الغروب." }, campaign: { en: "Nights of light, heritage and togetherness.", ar: "ليالٍ من النور والتراث واللمة." } },
  { key: "eidAlFitr", getDates: (year) => eidDates[year], discount: 20, icon: "☪", theme: "celebration", symbols: ["☪", "✦", "✧", "❋"], heroImage: "/Nile_Cruise/peter-hansen-MeGmdPNe36w-unsplash.webp", title: { en: "Eid travel celebration", ar: "احتفال عيد الفطر" }, copy: { en: "Celebrate Eid with a generous journey and a special rate.", ar: "احتفل بعيد الفطر برحلة مميزة وسعر خاص." }, campaign: { en: "Celebrate the journey, share the joy.", ar: "احتفل بالرحلة وشارك الفرحة." } },
  { key: "halloween", start: (year) => `${year}-10-25`, end: (year) => `${year}-11-01`, discount: 10, icon: "☠", theme: "desert-night", symbols: ["☠", "☾", "✦", "𓂀"], heroImage: "/Siwa/pexels-yasmeenabdelaziz22-27529795.webp", title: { en: "Halloween after dark", ar: "هالوين في قلب الصحراء" }, copy: { en: "A mysterious desert chapter for curious travellers.", ar: "فصل غامض في الصحراء لعشاق المغامرة." }, campaign: { en: "Follow the lantern. Find the legend.", ar: "اتبع الفانوس واكتشف الأسطورة." } },
];

let configuredEvents = events;

function readStoredSettings() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem("seasonal-events-settings");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function mergeSettings(settings) {
  if (!Array.isArray(settings)) return events;
  const byKey = new Map(settings.map((item) => [item.key, item]));
  return events.map((event) => {
    const setting = byKey.get(event.key);
    if (!setting) return event;
    return {
      ...event,
      enabled: setting.enabled !== false,
      discount: Number.isFinite(Number(setting.discount)) ? Number(setting.discount) : event.discount,
      annualStart: setting.annualStart || event.annualStart,
      annualEnd: setting.annualEnd || event.annualEnd,
      dates: setting.dates || event.dates,
    };
  });
}

export function configureSeasonalEvents(settings) {
  configuredEvents = mergeSettings(settings);
  return configuredEvents;
}

function getConfiguredEvents() {
  if (configuredEvents !== events) return configuredEvents;
  return mergeSettings(readStoredSettings());
}

function dateOnly(value) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getActiveSeasonalEvent(value = new Date()) {
  const current = dateOnly(value);
  const year = current.getFullYear();
  return getConfiguredEvents().find((event) => {
    if (event.enabled === false) return false;
    const dates = event.dates?.[year] || event.getDates?.(year) || (event.annualStart && event.annualEnd
      ? [`${year}-${event.annualStart}`, `${year}-${event.annualEnd}`]
      : [event.start(year), event.end(year)]);
    if (!dates) return false;
    return current >= dateOnly(`${dates[0]}T00:00:00`) && current <= dateOnly(`${dates[1]}T23:59:59`);
  }) || null;
}

export function applySeasonalDiscount(value, event = getActiveSeasonalEvent()) {
  const amount = Number(value) || 0;
  return event ? Number((amount * (1 - event.discount / 100)).toFixed(2)) : amount;
}

export function getSeasonalEvents() {
  return getConfiguredEvents();
}

export function getSeasonalEventByKey(key) {
  return getConfiguredEvents().find((event) => event.key === key) || null;
}

export function getSeasonalEventForDisplay(value = new Date()) {
  if (typeof window !== "undefined") {
    const previewKey = new URLSearchParams(window.location.search).get("seasonPreview");
    const previewEvent = previewKey && previewKey !== "picker" ? getSeasonalEventByKey(previewKey) : null;
    if (previewEvent) return previewEvent;
  }
  return getActiveSeasonalEvent(value);
}
