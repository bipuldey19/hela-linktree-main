import type { NextConfig } from "next";

// Standalone only in Docker (set DOCKER_BUILD=1 in Dockerfile). Server deploy uses normal build + next start.
const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
