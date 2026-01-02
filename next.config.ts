import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  experimental: {
    optimizePackageImports: ["motion", "date-fns"],
    // Note: React Compiler babel plugin causes build issues with Turbopack
    // Next.js 16's Turbopack provides excellent optimization without it
    // PPR is available in Next.js 16 - uncomment if needed: ppr: 'incremental',
  },
};

export default withBundleAnalyzer(nextConfig);

