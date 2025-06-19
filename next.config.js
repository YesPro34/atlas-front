/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'https://atlas-back-production.up.railway.app/',
        pathname: '/api/uploads/schoolCard/**',
      },
    ],
  },
}

module.exports = nextConfig 