/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ebayimg.com', 'ebayimg.com', 'thumbs.ebaystatic.com'],
    unoptimized: true,
  },
  // Allow serving static files from public/uploads
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Fix for cheerio/undici compatibility with Next.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side builds, completely ignore these packages
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
        'cheerio': false,
        'htmlparser2': false,
        'domutils': false,
        'css-select': false,
        'axios': false,
      };
    }
    return config;
  },
  // Note: serverExternalPackages is available in Next.js 15+, but we're on 14.2
  // The webpack config above handles externalizing these packages
}

module.exports = nextConfig

