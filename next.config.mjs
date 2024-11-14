/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    images: {
      domains: ['cloud.appwrite.io'],  // Add this line to allow images from cloud.appwrite.io
    },
  };
  
  export default nextConfig;
  