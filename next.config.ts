import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://avatars.slack-edge.com/**")],
  },
};

export default nextConfig;
