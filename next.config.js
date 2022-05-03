/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
  },
  images: {
    domains: ['gw.alipayobjects.com'],
  },
  trailingSlash: true,
  async rewrites() {
    return [
      // {
      //   source: '/blog/',
      //   destination: 'http://opac.its.csu.edu.cn/',
      // },
      {
        source: '/blog/:path*',
        destination: 'http://opac.its.csu.edu.cn/:path*',
      },
      // {
      //   source: '/blog/:path*',
      //   destination: 'http://proxysite.com/:path*',
      // },
    ]
  },
})
