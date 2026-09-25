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
      { source: "/default.jpg", destination: "/HomePageImage/banner.62f1bfcb.jpg" },
      { source: "/fallback.jpg", destination: "/HomePageImage/banner.62f1bfcb.jpg" },
      { source: "/default-avatar.png", destination: "/usa.webp" },
    ];
  },
};

export default nextConfig;
