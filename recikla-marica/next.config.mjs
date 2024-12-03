// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve('./src/components'),
      '@utils': path.resolve('./src/utils'),
      '@pages': path.resolve('./src/pages'),
      '@': path.resolve('./src'),
    };
    return config;
  },
};

export default nextConfig;
