import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable HTTPS in development environment
  server: {
    https: false,
  },
};

export default nextConfig;
