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
}

module.exports = nextConfig

