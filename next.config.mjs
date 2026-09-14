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
  
};

export default nextConfig;
