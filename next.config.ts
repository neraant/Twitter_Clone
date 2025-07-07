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
            ext: 'tsx',
          },
        },
      ],
    });

    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'i.pravatar.cc', 'picsum.photos'],
  },
};

export default nextConfig;
