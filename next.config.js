/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para Vercel
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  
  // Configurações de build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Otimizações de performance
  swcMinify: true,
  
  // Configurações de imagem
  images: {
    domains: [],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
