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

const annualDateDefaults = {
  newYear: ["01-01", "01-07"],
  valentinesDay: ["02-12", "02-15"],
  womensDay: ["03-08", "03-10"],
  mothersDay: ["03-21", "03-24"],
  halloween: ["10-25", "11-01"],
};

const events = [
  { key: "newYear", start: (year) => `${year}-01-01`, end: (year) => `${year}-01-07`, discount: 15, icon: "✦", theme: "midnight", symbols: ["✦", "✧", "·", "⟡"], heroImage: "/HomePageImage/banner-optimized.webp", title: { en: "New Year escape", ar: "احتفال رأس السنة" }, copy: { en: "Start the year with a story worth remembering.", ar: "ابدأ العام برحلة تستحق أن تُروى." }, campaign: { en: "A new chapter, written in Egypt.", ar: "فصل جديد تكتبه في مصر." } },
  { key: "valentinesDay", start: (year) => `${year}-02-12`, end: (year) => `${year}-02-15`, discount: 14, icon: "♥", theme: "valentine", symbols: ["♥", "♡", "✦", "❥"], heroImage: "/HomePageImage/pexels-taryn-elliott-4405249.webp", title: { en: "Valentine’s journeys", ar: "رحلات عيد الحب" }, copy: { en: "Share a beautiful escape and make this Valentine’s unforgettable.", ar: "شارك رحلة جميلة واجعل عيد الحب هذا لا يُنسى." }, campaign: { en: "Two hearts. One unforgettable journey.", ar: "قلبان ورحلة واحدة لا تُنسى." } },
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
      annualStart: setting.annualStart || event.annualStart || annualDateDefaults[event.key]?.[0],
      annualEnd: setting.annualEnd || event.annualEnd || annualDateDefaults[event.key]?.[1],
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

function resolveDatePart(value, year) {
  if (!value) return null;
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d{2}-\d{2}$/.test(text)) return `${year}-${text}`;
  return null;
}

function getEventWindow(event, year) {
  const annualStart = resolveDatePart(event.annualStart, year);
  const annualEnd = resolveDatePart(event.annualEnd, year);
  if (annualStart && annualEnd) {
    const start = dateOnly(`${annualStart}T00:00:00`);
    const end = dateOnly(`${annualEnd}T23:59:59`);
    if (end < start) end.setFullYear(end.getFullYear() + 1);
    return [start, end];
  }

  const dates = event.dates?.[year] || event.getDates?.(year) || (event.start && event.end ? [event.start(year), event.end(year)] : null);
  if (!dates) return null;
  return [dateOnly(`${dates[0]}T00:00:00`), dateOnly(`${dates[1]}T23:59:59`)];
}

function findActiveSeasonalEvent(eventList, value = new Date()) {
  const current = dateOnly(value);
  const year = current.getFullYear();
  return eventList.find((event) => {
    if (event.enabled === false) return false;
    return [year, year - 1].some((anchorYear) => {
      const window = getEventWindow(event, anchorYear);
      return window && current >= window[0] && current <= window[1];
    });
  }) || null;
}

export function getActiveSeasonalEvent(value = new Date()) {
  return findActiveSeasonalEvent(getConfiguredEvents(), value);
}

export function getActiveSeasonalEventFromSettings(settings, value = new Date()) {
  return findActiveSeasonalEvent(mergeSettings(settings), value);
}

const designTokens = {
  midnight: { main: "#e0bf78", accent: "#536fa3", glow: "rgba(83,111,163,.22)", background: "#07111f", text: "#f7f0df", heading: "#f5d891", surface: "rgba(12,27,47,.84)", border: "rgba(224,191,120,.52)", gradient: "linear-gradient(135deg, #f0d58f, #5477ac)" },
  rose: { main: "#f1b1b8", accent: "#a85a73", glow: "rgba(241,177,184,.2)", background: "#210d18", text: "#fff1ef", heading: "#ffd8d8", surface: "rgba(58,17,37,.84)", border: "rgba(241,177,184,.56)", gradient: "linear-gradient(135deg, #ffd3d1, #a85a73)" },
  blossom: { main: "#f0c58d", accent: "#b97955", glow: "rgba(240,197,141,.22)", background: "#24150f", text: "#fff3e1", heading: "#ffe0a9", surface: "rgba(69,36,24,.82)", border: "rgba(240,197,141,.56)", gradient: "linear-gradient(135deg, #ffe1ae, #b97955)" },
  lantern: { main: "#e7bd67", accent: "#3c9b91", glow: "rgba(231,189,103,.24)", background: "#071b1b", text: "#f7f0dd", heading: "#f5d486", surface: "rgba(13,48,45,.82)", border: "rgba(231,189,103,.56)", gradient: "linear-gradient(135deg, #f6d991, #3c9b91)" },
  celebration: { main: "#f4d27f", accent: "#458e7b", glow: "rgba(244,210,127,.24)", background: "#071d22", text: "#f6f5e9", heading: "#ffe09a", surface: "rgba(16,59,61,.82)", border: "rgba(244,210,127,.58)", gradient: "linear-gradient(135deg, #ffe39a, #458e7b)" },
  "desert-night": { main: "#d79655", accent: "#743b7a", glow: "rgba(215,150,85,.2)", background: "#160f20", text: "#f8eddf", heading: "#ffd18e", surface: "rgba(51,26,56,.82)", border: "rgba(215,150,85,.56)", gradient: "linear-gradient(135deg, #f0b879, #743b7a)" },
  valentine: { main: "#ff9fb4", accent: "#9d3158", glow: "rgba(255,96,140,.24)", background: "#250b18", text: "#fff0f4", heading: "#ffd1df", surface: "rgba(67,16,40,.84)", border: "rgba(255,159,180,.58)", gradient: "linear-gradient(135deg, #ffc2d2, #9d3158)" },
};

export function getSeasonalDesignTokens(event) {
  return designTokens[event?.theme] || null;
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
