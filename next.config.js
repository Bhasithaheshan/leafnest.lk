/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/images/products/:file*.JPG",
        destination: "/images/products/:file*.jpg",
      },
      {
        source: "/images/products/:file*.JPEG",
        destination: "/images/products/:file*.jpg",
      },
      {
        source: "/images/products/:file*.PNG",
        destination: "/images/products/:file*.png",
      },
    ];
  },
};

module.exports = nextConfig;
