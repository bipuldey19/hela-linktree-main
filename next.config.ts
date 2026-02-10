import type { NextConfig } from "next";

// Standalone only in Docker (set DOCKER_BUILD=1 in Dockerfile). Server deploy uses normal build + next start.
const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    localPatterns: [{ pathname: "/uploads/**" }],
  },
  serverExternalPackages: ["sharp"],
  // Serve /uploads/* via API so uploads work everywhere (Docker volumes, standalone, reverse proxy)
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: "/api/serve-upload/:path*" }];
  },
};

export default nextConfig;
