import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "22a8-2603-9008-1601-a5f0-d24d-c956-d663-5b4f.ngrok-free.app",
  ],
  images: {
    remotePatterns: [new URL("https://avatars.slack-edge.com/**")],
  },
  /* config options here */
};

export default nextConfig;
