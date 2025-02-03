/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // Ensures paths end with "/"
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    unoptimized: true, // Required for static exports
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/buckets/Images/files/**",
      },
    ],
  },
};

export default nextConfig;
