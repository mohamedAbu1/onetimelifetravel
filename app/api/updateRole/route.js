import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { forbidden, getAuthenticatedUser, unauthorized, isAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const { userId, newRole } = await req.json();
    if (!userId || !["USER", "ADMIN"].includes(newRole)) {
      return Response.json({ error: "Invalid role data" }, { status: 400 });
    }
    const db = await connectDB();

    // ✅ تحديث الدور في قاعدة البيانات
    await db.query("UPDATE users SET role = ? WHERE id = ?", [newRole, userId]);

    // ✅ رجع استجابة واضحة
    return NextResponse.json(
      { success: true, role: newRole, userId },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating role:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
