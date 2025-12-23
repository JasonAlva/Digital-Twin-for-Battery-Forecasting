/**
 * VoltTwin Frontend - Next.js Configuration
 * Optimized for faster development builds
 */

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
    scrollRestoration: true,
  },
  
  // Performance optimization
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.join(__dirname, '.next/cache'),
      buildDependencies: {
        config: [__filename],
      },
    };
    return config;
  },
};

module.exports = nextConfig;
