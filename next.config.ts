import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  serverExternalPackages: ["@keystatic/next", "@keystatic/core"],
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "127.0.0.1",
  ],
};

export default nextConfig;
