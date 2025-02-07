import withBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzerConfig({
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: 'utfs.io'
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = 'source-map';
    }

    return config;
  }
});