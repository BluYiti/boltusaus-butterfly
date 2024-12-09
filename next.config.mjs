/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
        pathname: '/v1/storage/buckets/Images/files/**', // You can adjust the pathname as needed
      },
    ],
  },
};

export default nextConfig;
