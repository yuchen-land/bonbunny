import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用開發環境中的 HTTPS
  server: {
    https: false,
  },
};

export default nextConfig;
