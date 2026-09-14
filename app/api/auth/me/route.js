// file: app/api/auth/me/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { normalizeImageUrl } from "@/lib/imageUrl";

export async function GET(request) {
  try {
    const accessToken = request.cookies.get("access-token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    return NextResponse.json({ user: { ...decoded, avatar_url: normalizeImageUrl(decoded.avatar_url, "/default-avatar.png") } }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
