import { NextResponse } from "next/server";

const contactAttempts = new Map();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const recent = (contactAttempts.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW);
    if (recent.length >= RATE_LIMIT_MAX) {
      const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - recent[0])) / 1000);
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
    }
    recent.push(now);
    contactAttempts.set(ip, recent);
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !phone || !email || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 });
    }
    if ([name, phone, email, message].some((value) => value.length > 2000)) {
      return NextResponse.json({ success: false, error: "Input is too long" }, { status: 413 });
    }

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: "OneTimeLifeTravel@outlook.com" }], subject: `New Contact Form Submission from ${name}` }],
        from: { email: "mohamedahmed33m11@gmail.com" },
        content: [{
          type: "text/html",
          value: `<html><body style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;"><div style="max-width:600px;margin:auto;background:#fff;padding:30px;"><h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><div>${escapeHtml(message).replace(/\n/g, "<br />")}</div></div></body></html>`,
        }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: "Unable to send message" }, { status: 502 });
    }
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}


