import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Permitir otimização das imagens locais
    remotePatterns: [],
    unoptimized: false,
  },
  // Configurar base path se necessário
  basePath: "",
};

export default nextConfig;
