import { connectDB } from "@/lib/db";
import { getSeasonalEvents } from "@/lib/seasonalEvents";

const table = `
  CREATE TABLE IF NOT EXISTS seasonal_events (
    event_key VARCHAR(64) PRIMARY KEY,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    discount DECIMAL(5,2) NOT NULL DEFAULT 0,
    annual_start VARCHAR(10) NULL,
    annual_end VARCHAR(10) NULL,
    dates_json TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const annualDates = {
  newYear: ["01-01", "01-07"],
  valentinesDay: ["02-12", "02-15"],
  womensDay: ["03-08", "03-10"],
  mothersDay: ["03-21", "03-24"],
  halloween: ["10-25", "11-01"],
};

export function getDefaultSeasonalSettings() {
  return getSeasonalEvents().map((event) => ({
    key: event.key,
    enabled: event.enabled !== false,
    discount: event.discount,
    annualStart: event.annualStart || annualDates[event.key]?.[0] || "",
    annualEnd: event.annualEnd || annualDates[event.key]?.[1] || "",
    dates: event.dates || {},
    title: event.title,
    copy: event.copy,
    campaign: event.campaign,
    icon: event.icon,
    theme: event.theme,
    symbols: event.symbols,
    heroImage: event.heroImage,
    updatedAt: null,
  }));
}

export async function readSeasonalSettings() {
  const db = await connectDB();
  await db.query(table);
  // Older deployments created these columns as VARCHAR(5). Expand them so
  // exact Ramadan/Eid dates (YYYY-MM-DD) can be stored without truncation.
  try {
    await db.query("ALTER TABLE seasonal_events MODIFY annual_start VARCHAR(10) NULL, MODIFY annual_end VARCHAR(10) NULL");
  } catch (error) {
    console.warn("seasonal_events schema migration skipped:", error?.message || error);
  }
  const [rows] = await db.query("SELECT event_key, enabled, discount, annual_start, annual_end, dates_json, updated_at FROM seasonal_events");
  const saved = new Map(rows.map((row) => [row.event_key, row]));

  return getDefaultSeasonalSettings().map((event) => {
    const row = saved.get(event.key);
    if (!row) return event;
    let dates = {};
    try { dates = row.dates_json ? JSON.parse(row.dates_json) : {}; } catch { dates = {}; }
    return {
      ...event,
      enabled: Boolean(row.enabled),
      discount: Number(row.discount),
      annualStart: row.annual_start || "",
      annualEnd: row.annual_end || "",
      dates,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    };
  });
}
