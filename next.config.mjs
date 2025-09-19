/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
     images: {
    domains: ['amritara.cinuniverse.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'amritara.cinuniverse.com',
        pathname: '/admin/**',
      },
      {
        protocol: "https",
        hostname: "clarkscms.cinuniverse.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "clarkscms.cinuniverse.com",
        pathname: "/images/clarks/**",
      },
      {
        protocol: "https",
        hostname: "clarkscms.cinuniverse.com",
        pathname: "/images/media/**",
      },
      {
        protocol: "https",
        hostname: "clarkscms.cinuniverse.com",
        pathname: "/images/brand/**",
      },
      {
        protocol: "https",
        hostname: "clarkscms.cinuniverse.com",
        pathname: "/images/discover/**",
      },
      {
        protocol: "https",
        hostname: "homesweb.staah.net",
        pathname: "/imagelibrary/**",
      },
      {
        protocol: "https",
        hostname: "clarkscms.cinuniverse.com",
        pathname: "/images/offers/**",
      },
      {
        protocol: "http",
        hostname: "loyaltypulsedemo.ownyourcustomers.in",
        pathname: "/cms/images/uploads/**",
      },
    ],
  }
}

export default nextConfig;
