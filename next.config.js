/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'i.ibb.co',
      'res.cloudinary.com'
    ],
  }
};

module.exports = withNextIntl(nextConfig);
