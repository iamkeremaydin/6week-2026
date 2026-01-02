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
    // Automatic memoization - eliminates need for manual useMemo/useCallback
    reactCompiler: true,
    // PPR requires Next.js canary - uncomment after upgrading: ppr: 'incremental',
  },
};

export default withBundleAnalyzer(nextConfig);

