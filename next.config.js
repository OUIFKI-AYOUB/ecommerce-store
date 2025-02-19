/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'i.ibb.co',
      'res.cloudinary.com',
      'localhost',
      process.env.NEXT_PUBLIC_URL ? new URL(process.env.NEXT_PUBLIC_URL).hostname : null
    ].filter(Boolean),
  }
};

module.exports = withNextIntl(nextConfig);
