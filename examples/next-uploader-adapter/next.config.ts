import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@uploadcare/react-uploader"],
  turbopack: {
    root: "../../",
  },
};

export default nextConfig;
