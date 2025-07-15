import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          },
        },
      ],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'tyijrtgqykgvxzlwllbg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['tyijrtgqykgvxzlwllbg.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '26mb',
    },
  },
  reactStrictMode: true,
};

export default withBundleAnalyzer(nextConfig);
