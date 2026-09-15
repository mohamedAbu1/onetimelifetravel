import { NextResponse } from "next/server";
import { getDefaultSeasonalSettings, readSeasonalSettings } from "@/lib/seasonalEventSettings";
import { getActiveSeasonalEventFromSettings, getSeasonalDesignTokens } from "@/lib/seasonalEvents";

export const dynamic = "force-dynamic";

function headers() {
  return {
    "Access-Control-Allow-Origin": process.env.SEASONAL_APP_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store, max-age=0",
  };
}

function cairoDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function dateFromQuery(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "") ? new Date(`${value}T12:00:00`) : new Date(`${cairoDate()}T12:00:00`);
}

function serialize(event) {
  if (!event) return null;
  return {
    key: event.key,
    enabled: event.enabled !== false,
    discount: Number(event.discount) || 0,
    annualStart: event.annualStart || null,
    annualEnd: event.annualEnd || null,
    dates: event.dates || {},
    title: event.title,
    copy: event.copy,
    campaign: event.campaign,
    icon: event.icon,
    theme: event.theme,
    symbols: event.symbols || [],
    heroImage: event.heroImage || null,
    updatedAt: event.updatedAt || null,
    design: getSeasonalDesignTokens(event),
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: headers() });
}

export async function GET(request) {
  const url = new URL(request.url);
  const requestedDate = url.searchParams.get("date");
  const previewKey = url.searchParams.get("preview");
  const effectiveDate = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate || "") ? requestedDate : cairoDate();
  let settings;
  try {
    settings = await readSeasonalSettings();
  } catch (error) {
    console.error("GET /seasonal-events/active error:", error);
    settings = getDefaultSeasonalSettings();
  }

  const event = previewKey
    ? settings.find((item) => item.key === previewKey && item.enabled !== false) || null
    : getActiveSeasonalEventFromSettings(settings, dateFromQuery(effectiveDate));

  return NextResponse.json({
    success: true,
    source: "onetimelifetravel-seasonal-events",
    serverDate: effectiveDate,
    timezone: "Africa/Cairo",
    preview: Boolean(previewKey),
    active: Boolean(event),
    event: serialize(event),
  }, { headers: headers() });
}
