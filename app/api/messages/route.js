import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    const contentType = req.headers.get("content-type") || "";

    // 📌 لو الرسالة صورة
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      if (!file.type?.startsWith("image/") || file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Only images up to 10MB are allowed" }, { status: 400 });
      }

      const extension = path.extname(file.name || "").toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      if (!allowedExtensions.includes(extension)) {
        return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
      }
      const fileName = `${uuidv4()}${extension}`;
      const baseUrl = `/iamges/${fileName}`;

      // مسار المشروع المحلي
      const projectPath = path.join(process.cwd(), "public/iamges", fileName);

      // تجهيز المجلد المحلي
      await fs.promises.mkdir(path.dirname(projectPath), { recursive: true });

      // تحويل الملف إلى buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // حفظ نسخة في المشروع
      await fs.promises.writeFile(projectPath, buffer);

      // باقي البيانات
      const user_id = formData.get("user_id");
      if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

      const sender_type = formData.get("sender_type") || "user";
      if (sender_type === "admin" && !isAdmin(user)) return forbidden();
      const user_name = user.name || formData.get("user_name") || "User";
      const user_image = user.avatar_url || formData.get("user_image") || "/default-avatar.png";
      const reply_to = formData.get("reply_to");
      const admin_id = isAdmin(user) ? user.id : null;

      const db = await connectDB();
      const messagesId = uuidv4();

      await db.query(
        `INSERT INTO messages 
         (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
        [messagesId, user_id, baseUrl, sender_type, user_name, user_image, reply_to ?? null, admin_id],
      );

      await db.query(
        `INSERT INTO notifications (id, event_type, message, user_id, user_name, user_image, type, created_at, is_read)
         VALUES (?, 'message', ?, ?, ?, ?, 'message', NOW(), 0)`,
        [uuidv4(), sender_type === "admin" ? `New reply from One Time Life Travel` : `New message from ${user_name}`, user_id, user_name, user_image],
      );

      const newMessage = {
        id: messagesId,
        user_id,
        content: baseUrl,
        sender_type,
        user_name,
        user_image,
        reply_to,
        admin_id,
        status: "sent",
        created_at: new Date(),
      };

      return NextResponse.json(newMessage, { status: 201 });
    }

    // 📌 لو الرسالة نصية
    const body = await req.json();
    const { content, sender_type: requestedSenderType = "user", reply_to = null } = body;
    const sender_type = isAdmin(user) ? (requestedSenderType === "admin" ? "admin" : "user") : "user";
    const user_id = isAdmin(user) ? body.user_id : user.id;
    const user_name = sender_type === "admin" ? (user.name || "One Time Life Travel") : (user.name || "Unknown User");
    const user_image = user.avatar_url || "/default-avatar.png";
    const admin_id = isAdmin(user) ? user.id : null;

    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (!content) return NextResponse.json({ error: "Content cannot be null" }, { status: 400 });

    const db = await connectDB();
    const messagesId = uuidv4();

    await db.query(
      `INSERT INTO messages 
       (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
      [messagesId, user_id, content, sender_type, user_name, user_image, reply_to, admin_id],
    );

    await db.query(
      `INSERT INTO notifications (id, event_type, message, user_id, user_name, user_image, type, created_at, is_read)
       VALUES (?, 'message', ?, ?, ?, ?, 'message', NOW(), 0)`,
      [uuidv4(), sender_type === "admin" ? "New reply from One Time Life Travel" : `New message from ${user_name}`, user_id, user_name, user_image],
    );

    const newMessage = {
      id: messagesId,
      user_id,
      content,
      sender_type,
      user_name,
      user_image,
      reply_to,
      admin_id,
      status: "sent",
      created_at: new Date(),
    };

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("❌ Error inserting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const messageId = searchParams.get("messageId");

    const db = await connectDB();
    let query = `SELECT id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id,user_id , status 
                 FROM messages`;
    let params = [];

    if (messageId) {
      query += isAdmin(user) ? ` WHERE id = ?` : ` WHERE id = ? AND user_id = ?`;
      params.push(messageId);
      if (!isAdmin(user)) params.push(user.id);
    } else if (userId) {
      if (!isAdmin(user) && userId !== user.id) return forbidden();
      query += ` WHERE user_id = ?`;
      params.push(userId);
    } else if (!isAdmin(user)) {
      query += ` WHERE user_id = ?`;
      params.push(user.id);
    }

    query += ` ORDER BY created_at ASC`;

    const [rows] = await db.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ تحديث حالة الرسالة
export async function PUT(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { messageId, status = "seen" } = body;

    const db = await connectDB();
    const [result] = await db.query(
      `UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, messageId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message updated successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error updating message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ حذف رسالة
export async function DELETE(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { messageId } = body;

    const db = await connectDB();
    const [result] = await db.query(`DELETE FROM messages WHERE id = ?`, [
      messageId,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message deleted successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error deleting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
