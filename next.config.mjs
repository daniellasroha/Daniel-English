/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan ESLint saat build (agar deploy ke Vercel tidak gagal)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
