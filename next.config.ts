import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        '*.devtunnels.ms'
      ]
    }
  }
};

export default nextConfig;