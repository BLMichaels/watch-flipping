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
  webpack: (config, { isServer, webpack }) => {
    // Only apply to server-side builds
    if (isServer) {
      // Externalize undici to avoid build issues
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'commonjs undici',
        'cheerio': 'commonjs cheerio',
      });
    } else {
      // For client-side, ignore these packages completely
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'undici': false,
        'cheerio': false,
      };
    }
    return config;
  },
  // Ensure server-side only packages are handled correctly
  serverExternalPackages: ['cheerio', 'undici'],
}

module.exports = nextConfig

