import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'source.unsplash.com',
      'www.artic.edu',
      'images.metmuseum.org',
      'www.metmuseum.org',
      'lakeimagesweb.artic.edu',
      'api.artic.edu'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.artic.edu',
        pathname: '/iiif/**',
      },
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
        pathname: '/CRDImages/**',
      },
      {
        protocol: 'https',
        hostname: 'lakeimagesweb.artic.edu',
        pathname: '/iiif/**',
      },
      {
        protocol: 'https',
        hostname: 'api.artic.edu',
        pathname: '/api/v1/artworks/**',
      }
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig 