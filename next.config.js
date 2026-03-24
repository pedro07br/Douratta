/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
  images: {
    domains: ['images.unsplash.com']
  }
}

module.exports = nextConfig