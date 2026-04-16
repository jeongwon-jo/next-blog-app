import type { NextConfig } from "next";
import removeImportsCreator from "next-remove-imports";

const removeImports = removeImportsCreator();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dgxtqvcswgkvcdbjlmpw.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**"
      },
    ],
  },
};

export default removeImports(nextConfig);
