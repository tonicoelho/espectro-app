/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    NEXT_PUBLIC_DATA_LITE: process.env.NEXT_PUBLIC_DATA_LITE || 'false',
  },

  // Image optimization (disabled in Data-Lite mode)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.globo.com',
      },
      {
        protocol: 'https',
        hostname: '**.uol.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.estadao.com.br',
      },
    ],
  },

  // Enable Server-Side Rendering for SEO
  experimental: {
    // Enable app directory features
  },
};

module.exports = nextConfig;
