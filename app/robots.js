export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
    sitemap: "https://onetimelifetravel.com/sitemap.xml",
  };
}
