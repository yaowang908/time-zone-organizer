/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for the time zone organizer app
  // Only include specific file extensions as pages, excluding test files
  pageExtensions: [
    'page.tsx',
    'page.ts',
    'page.jsx',
    'page.js',
    'tsx',
    'ts',
    'jsx',
    'js',
  ],
  // Configure experimental features to exclude test files
  experimental: {
    // Exclude test directories from the build
    outputFileTracingExcludes: {
      '*': ['**/__tests__/**', '**/*.test.*', '**/*.spec.*'],
    },
  },
};

module.exports = nextConfig;
