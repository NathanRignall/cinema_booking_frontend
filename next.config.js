/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  async rewrites() {
      return [
          {
              source: "/api/:slug*",
              destination: "http://localhost:4000/:slug*",
          },
      ];
  },
};