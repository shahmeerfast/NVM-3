import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // For VPS deployment
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  }
};

export default nextConfig;
