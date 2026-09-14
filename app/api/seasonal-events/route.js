import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";
import { getSeasonalEvents } from "@/lib/seasonalEvents";

const table = `
  CREATE TABLE IF NOT EXISTS seasonal_events (
    event_key VARCHAR(64) PRIMARY KEY,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    discount DECIMAL(5,2) NOT NULL DEFAULT 0,
    annual_start VARCHAR(5) NULL,
    annual_end VARCHAR(5) NULL,
    dates_json TEXT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

const annualDates = {
  newYear: ["01-01", "01-07"],
  womensDay: ["03-08", "03-10"],
  mothersDay: ["03-21", "03-24"],
  halloween: ["10-25", "11-01"],
};

function defaults() {
  return getSeasonalEvents().map((event) => ({
    key: event.key,
    enabled: event.enabled !== false,
    discount: event.discount,
    annualStart: event.annualStart || annualDates[event.key]?.[0] || "",
    annualEnd: event.annualEnd || annualDates[event.key]?.[1] || "",
    dates: event.dates || {},
    title: event.title,
    icon: event.icon,
    theme: event.theme,
  }));
}

async function readSettings() {
  const db = await connectDB();
  await db.query(table);
  const [rows] = await db.query("SELECT event_key, enabled, discount, annual_start, annual_end, dates_json FROM seasonal_events");
  const saved = new Map(rows.map((row) => [row.event_key, row]));
  return defaults().map((event) => {
    const row = saved.get(event.key);
    if (!row) return event;
    let dates = {};
    try { dates = row.dates_json ? JSON.parse(row.dates_json) : {}; } catch { dates = {}; }
    return { ...event, enabled: Boolean(row.enabled), discount: Number(row.discount), annualStart: row.annual_start || "", annualEnd: row.annual_end || "", dates };
  });
}

export async function GET() {
  try {
    return NextResponse.json({ events: await readSettings() });
  } catch (error) {
    console.error("GET /seasonal-events error:", error);
    return NextResponse.json({ events: defaults(), warning: "Database settings are unavailable; defaults returned." });
  }
}

export async function PUT(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const body = await req.json();
    const event = defaults().find((item) => item.key === body.key);
    if (!event) return NextResponse.json({ error: "Unknown seasonal event" }, { status: 400 });
    const discount = Number(body.discount);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) return NextResponse.json({ error: "Discount must be between 0 and 100" }, { status: 400 });
    const dates = body.dates && typeof body.dates === "object" ? body.dates : {};
    const db = await connectDB();
    await db.query(table);
    await db.query(`INSERT INTO seasonal_events (event_key, enabled, discount, annual_start, annual_end, dates_json) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), discount = VALUES(discount), annual_start = VALUES(annual_start), annual_end = VALUES(annual_end), dates_json = VALUES(dates_json)`, [event.key, body.enabled === false ? 0 : 1, discount, body.annualStart || null, body.annualEnd || null, JSON.stringify(dates)]);
    return NextResponse.json({ events: await readSettings() });
  } catch (error) {
    console.error("PUT /seasonal-events error:", error);
    return NextResponse.json({ error: "Unable to save seasonal settings" }, { status: 500 });
  }
}
