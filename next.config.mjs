/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/art/:path*.mov",
        headers: [{ key: "Content-Type", value: "video/quicktime" }],
      },
    ]
  },
}

export default nextConfig
