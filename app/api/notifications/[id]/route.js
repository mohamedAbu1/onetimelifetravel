import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";


export async function DELETE(req, { params }) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const db = await connectDB();
    const { id } = await params; // نأخذ id من الرابط مثل /api/notifications/[id]

    await db.execute("DELETE FROM notifications WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "تم حذف الإشعار بنجاح" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
