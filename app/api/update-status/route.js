// /app/api/update-status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ملف الاتصال بقاعدة بيانات MySQL
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const { purchaseId, status } = await req.json();
    if (!purchaseId || !["Pending", "Confirmed", "Cancelled", "Completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid purchase status" }, { status: 400 });
    }
    const db = await connectDB();

    // ✅ تحديث حالة الحجز
    const [result] = await db.query(
      `UPDATE purchases 
       SET status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [status, purchaseId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
