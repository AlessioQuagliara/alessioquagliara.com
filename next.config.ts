import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.142"],
  images: {
    // Serve AVIF quando il browser lo supporta, con fallback a WebP.
    // next/image negozia il formato in automatico via header Accept.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
