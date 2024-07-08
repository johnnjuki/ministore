/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "olive-labour-earthworm-132.mypinata.cloud",
      },
    ],
  },
};

export default nextConfig;
