/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages configuration
  basePath: '/lnconnext',
  assetPrefix: '/lnconnext/',
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 