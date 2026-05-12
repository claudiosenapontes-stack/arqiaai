import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Turbopack picking the wrong monorepo root due to /root/clawd/package-lock.json
    root: __dirname,
  },
};

export default nextConfig;
