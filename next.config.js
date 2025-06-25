/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src/style'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
