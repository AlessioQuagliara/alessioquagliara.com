import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.142"],
  images: {
    // Serve AVIF quando il browser lo supporta, con fallback a WebP.
    // next/image negozia il formato in automatico via header Accept.
    formats: ["image/avif", "image/webp"],
  },
  // Le vecchie pagine ora sono sezioni della home.
  async redirects() {
    return [
      { source: "/about", destination: "/#chi-sono", permanent: true },
      { source: "/formazione", destination: "/#esperienza", permanent: true },
      { source: "/contact", destination: "/#contatti", permanent: true },
      { source: "/projects", destination: "/#progetti", permanent: true },
    ];
  },
};

export default nextConfig;
