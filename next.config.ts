import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Note: instrumentationHook is enabled by default when instrumentation.ts exists
  
  experimental: {
    optimizePackageImports: ["motion", "date-fns"],
    reactCompiler: true, // Enable React 19 Compiler for automatic memoization
    // Note: ppr is only available in Next.js canary
    // Uncomment when upgrading to canary: ppr: 'incremental',
  },
};

export default withBundleAnalyzer(nextConfig);

