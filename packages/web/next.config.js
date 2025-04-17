/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // Otimização de imagens
  images: {
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Otimizações de compilação e performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  
  // Configuração de cache para páginas estáticas
  staticPageGenerationTimeout: 120,
  
  // Otimização de pacotes
  experimental: {
    scrollRestoration: true,
  },
  
  // Desabilitar exportação estática para evitar erros no build
  trailingSlash: true, // Adicionar trailing slash às URLs
  
  // Configuração para páginas dinâmicas
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
      '/500': { page: '/500' },
    };
  },
  
  // Configuração de Headers para todos os paths
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configuração de tratamento de rotas para o ambiente de proxy do Easypanel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://api:3001/:path*'
      },
      {
        source: '/plane/:path*',
        destination: 'http://plane:3000/:path*'
      },
      {
        source: '/outline/:path*',
        destination: 'http://outline:3001/:path*'
      }
    ];
  }
}

module.exports = nextConfig 