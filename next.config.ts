import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores a stray package-lock.json in $HOME.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
