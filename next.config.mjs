/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "onetimelifetravel.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "onetimelifetravel.com",
        pathname: "/images/**",
      },
    ],
  },
  
};

export default nextConfig;
