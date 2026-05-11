import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Turbopack picking the wrong monorepo root due to /root/clawd/package-lock.json
    root: __dirname,
  },
  async rewrites() {
    return [
      // Serve the static firm home (public/home.html) at /
      { source: "/", destination: "/home.html" },
    ];
  },
};

export default nextConfig;
