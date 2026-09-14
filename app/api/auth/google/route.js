import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { setAuthCookies } from "@/lib/auth";

const createSession = (user) => {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  return setAuthCookies(NextResponse.json(user), accessToken, refreshToken);
};

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const name = String(body?.name || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });

    const db = await connectDB();
    const [rows] = await db.query("SELECT id, name, role, avatar_url, gender FROM users WHERE email = ?", [email]);
    if (!rows.length) {
      const id = uuidv4();
      const displayName = name || email.split("@")[0];
      await db.query("INSERT INTO users (id, email, name, gender, role, created_at) VALUES (?, ?, ?, ?, 'USER', NOW())", [id, email, displayName, "unspecified"]);
      return createSession({ id, email, name: displayName, role: "USER", avatar_url: null, gender: "unspecified" });
    }
    const row = rows[0];
    return createSession({ id: row.id, email, name: row.name || name, role: row.role || "USER", avatar_url: row.avatar_url, gender: row.gender });
  } catch (error) {
    console.error("Google session error:", error);
    return NextResponse.json({ error: "Unable to create session" }, { status: 500 });
  }
}
