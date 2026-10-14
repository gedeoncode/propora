import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  reactCompiler: true,
};

export default nextConfig;
