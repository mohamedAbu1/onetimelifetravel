/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "onetimelifetravel.com",
        pathname: "/iamges/**",
      },
      {
        protocol: "https",
        hostname: "basttettravel.com",
        pathname: "/iamges/**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/default.jpg", destination: "/HomePageImage/banner-optimized.webp" },
      { source: "/fallback.jpg", destination: "/HomePageImage/banner-optimized.webp" },
      { source: "/default-avatar.png", destination: "/usa.webp" },
    ];
  },
};

export default nextConfig;
