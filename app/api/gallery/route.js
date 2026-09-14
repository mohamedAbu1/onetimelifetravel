// api/gallery/route.js
import fs from "fs";
import path from "path";
import { forbidden, getAuthenticatedUser, isAdmin, unauthorized } from "@/lib/auth";

export async function POST(req) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) return unauthorized();
    if (!isAdmin(user)) return forbidden();
    const formData = await req.formData();
    const galleryFiles = formData.getAll("gallery_images");
    const folder = "iamges";
    const uploadDir = path.join(process.cwd(), "public", folder);
    await fs.promises.mkdir(uploadDir, { recursive: true });

    let galleryImageObjects = [];

    if (galleryFiles?.length > 0) {
      for (const file of galleryFiles) {
        if (!file.type?.startsWith("image/") || file.size > 8 * 1024 * 1024) return new Response(JSON.stringify({ success: false, error: "Invalid image or file too large" }), { status: 413 });
        const extension = path.extname(file.name).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) return new Response(JSON.stringify({ success: false, error: "Unsupported image format" }), { status: 415 });
        const originalName = `gallery-${Date.now()}-${crypto.randomUUID()}${extension}`;
        const uploadPath = path.join(uploadDir, originalName);

        await fs.promises.writeFile(uploadPath, Buffer.from(await file.arrayBuffer()));

        const fileUrl = `/${folder}/${originalName}`;

        // ✅ استقبل أسماء اللغات من الـ formData
        const nameTranslations = {
          en: formData.get(`name_en_${originalName}`) || originalName,
          ar: formData.get(`name_ar_${originalName}`) || "",
          fr: formData.get(`name_fr_${originalName}`) || "",
          de: formData.get(`name_de_${originalName}`) || "",
          it: formData.get(`name_it_${originalName}`) || "",
          zh: formData.get(`name_zh_${originalName}`) || "",
          es: formData.get(`name_es_${originalName}`) || "",
        };

        galleryImageObjects.push({
          url: fileUrl,
          name: nameTranslations,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, gallery_images: galleryImageObjects }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
