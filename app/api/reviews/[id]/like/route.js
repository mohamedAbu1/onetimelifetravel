import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser, unauthorized } from "@/lib/auth";

// ✅ جلب اللايكات
export async function GET(req, { params }) {
  try {
    const { id: reviewId } = await params;

    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT user_id FROM review_likes WHERE review_id = ?",
      [reviewId]
    );

    return NextResponse.json({
      ok: true,
      count: rows.length,
      users: rows.map((r) => r.user_id),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ إضافة لايك
export async function POST(req, { params }) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    const { id: reviewId } = await params;

    const user_id = user.id;

    const db = await connectDB();
    await db.query(
      "INSERT IGNORE INTO review_likes (review_id, user_id, created_at) VALUES (?, ?, NOW())",
      [reviewId, user_id]
    );

    return NextResponse.json({ ok: true, message: "Like added successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ إزالة لايك
export async function DELETE(req, { params }) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    const { id: reviewId } = await params;

    const user_id = user.id;

    const db = await connectDB();
    await db.query(
      "DELETE FROM review_likes WHERE review_id = ? AND user_id = ?",
      [reviewId, user_id]
    );

    return NextResponse.json({ ok: true, message: "Like removed successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
