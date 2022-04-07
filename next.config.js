/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: 'public',
  },
  images: {
    domains: ['gw.alipayobjects.com'],
  },
})
