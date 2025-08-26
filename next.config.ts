import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  
  // Enable experimental features
  experimental: {
    // Moved turbo to the root level
  },
  
  // Turbo configuration
  turbopack: {
    rules: {
      "*.svg": ["@svgr/webpack"],
    },
  },
  
  // Configure images
  images: {
    domains: ['mysidomuncul.sidomuncul.co.id'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://mysidomuncul.sidomuncul.co.id',
  },
  
  // Proxy configuration for API requests
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mysidomuncul.sidomuncul.co.id/v1/api/web/:path*',
      },
    ];
  },
};

export default nextConfig;
