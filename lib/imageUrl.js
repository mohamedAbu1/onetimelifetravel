const legacyHosts = new Set(["onetimelifetravel.com", "www.onetimelifetravel.com", "basttettravel.com", "www.basttettravel.com"]);
export const DEFAULT_IMAGE = "/HomePageImage/banner-optimized.webp";
export const DEFAULT_AVATAR = "/usa.webp";

export function normalizeImageUrl(value, fallback = DEFAULT_IMAGE) {
  if (!value || typeof value !== "string") return fallback;
  const clean = value.replace(/\\/g, "/");
  try {
    const url = new URL(clean);
    if (legacyHosts.has(url.hostname) && url.pathname.startsWith("/iamges/")) return url.pathname;
    return clean;
  } catch {
    return clean.startsWith("/") ? clean : fallback;
  }
}

export function normalizeGallery(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => typeof item === "string" ? normalizeImageUrl(item) : ({ ...item, url: normalizeImageUrl(item?.url) }));
}
