import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeTitle',
                  active: true,
                },
                {
                  name: 'removeDesc',
                  active: true,
                },
              ],
            },
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

export default nextConfig;
