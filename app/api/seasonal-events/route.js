import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";
import { getDefaultSeasonalSettings, readSeasonalSettings } from "@/lib/seasonalEventSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ events: await readSeasonalSettings() });
  } catch (error) {
    console.error("GET /seasonal-events error:", error);
    return NextResponse.json({ events: getDefaultSeasonalSettings(), warning: "Database settings are unavailable; defaults returned." });
  }
}

export async function PUT(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const body = await req.json();
    const event = getDefaultSeasonalSettings().find((item) => item.key === body.key);
    if (!event) return NextResponse.json({ error: "Unknown seasonal event" }, { status: 400 });
    const discount = Number(body.discount);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) return NextResponse.json({ error: "Discount must be between 0 and 100" }, { status: 400 });
    const dates = body.dates && typeof body.dates === "object" ? body.dates : {};
    const db = await connectDB();
    await db.query(`
      CREATE TABLE IF NOT EXISTS seasonal_events (
        event_key VARCHAR(64) PRIMARY KEY,
        enabled TINYINT(1) NOT NULL DEFAULT 1,
        discount DECIMAL(5,2) NOT NULL DEFAULT 0,
        annual_start VARCHAR(10) NULL,
        annual_end VARCHAR(10) NULL,
        dates_json TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await db.query(`INSERT INTO seasonal_events (event_key, enabled, discount, annual_start, annual_end, dates_json) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), discount = VALUES(discount), annual_start = VALUES(annual_start), annual_end = VALUES(annual_end), dates_json = VALUES(dates_json)`, [event.key, body.enabled === false ? 0 : 1, discount, body.annualStart || null, body.annualEnd || null, JSON.stringify(dates)]);
    return NextResponse.json({ events: await readSeasonalSettings() });
  } catch (error) {
    console.error("PUT /seasonal-events error:", error);
    return NextResponse.json({ error: "Unable to save seasonal settings" }, { status: 500 });
  }
}
