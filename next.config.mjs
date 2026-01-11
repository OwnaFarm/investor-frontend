/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    '@privy-io/react-auth',
    '@privy-io/wagmi',
    'pino',
    'thread-stream',
  ],
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

export default nextConfig
