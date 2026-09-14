// api/cover/route.js
import fs from "fs";
import path from "path";
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const formData = await req.formData();
    const coverFile = formData.get("cover_image");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);

    let coverImageUrl = null;
    await fs.promises.mkdir(uploadDir, { recursive: true });

    if (coverFile) {
      if (!coverFile.type?.startsWith("image/") || coverFile.size > 8 * 1024 * 1024) return new Response(JSON.stringify({ success: false, error: "Invalid image or file too large" }), { status: 413 });
      const extension = path.extname(coverFile.name).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) return new Response(JSON.stringify({ success: false, error: "Unsupported image format" }), { status: 415 });
      const originalName = `cover-${Date.now()}-${crypto.randomUUID()}${extension}`;
      const uploadPath = path.join(uploadDir, originalName);

      await fs.promises.writeFile(uploadPath, Buffer.from(await coverFile.arrayBuffer()));

      coverImageUrl = `/${folder}/${originalName}`;
    }

    return new Response(JSON.stringify({ success: true, cover_image: coverImageUrl }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
