/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/arrival/:id',
        destination: '/heritage/:id',
        permanent: true,
      },
      {
        source: '/monastery/:id',
        destination: '/heritage/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
