/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache')
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client"],
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
    buildExcludes: [/middleware-manifest.json$/],
  },
  images: {
    domains: ['gw.alipayobjects.com', 'avatar.vercel.sh'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
