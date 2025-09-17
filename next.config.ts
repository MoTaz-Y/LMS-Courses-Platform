import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'almotaz-lms.t3.storage.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
