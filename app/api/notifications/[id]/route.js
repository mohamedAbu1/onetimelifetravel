import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";


export async function DELETE(req, { params }) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    const db = await connectDB();
    const { id } = await params; // نأخذ id من الرابط مثل /api/notifications/[id]

    await db.execute(
      isAdmin(user) ? "DELETE FROM notifications WHERE id = ?" : "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      isAdmin(user) ? [id] : [id, user.id],
    );

    return NextResponse.json({ success: true, message: "تم حذف الإشعار بنجاح" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
