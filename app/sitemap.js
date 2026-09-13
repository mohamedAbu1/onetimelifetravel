const baseUrl = "https://onetimelifetravel.com";
const locales = ["en", "de", "es", "fr", "it", "zh"];
const routes = ["", "/about", "/trips", "/contact", "/destinations/luxor", "/destinations/aswan"];

export default function sitemap() {
  return locales.flatMap((locale) => routes.map((route) => ({
    url: `${baseUrl}/${locale}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/trips" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/destinations/") ? 0.85 : 0.7,
  })));
}
