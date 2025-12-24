import type {NextConfig} from 'next';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';
const apiUrl = new URL(apiBase);
const apiProtocol: 'http' | 'https' = apiUrl.protocol === 'https:' ? 'https' : 'http';
const apiHostname = apiUrl.hostname;
const apiPort = apiUrl.port === '' ? undefined : apiUrl.port;
const apiPathname = apiUrl.pathname.replace(/\/$/, '');
const mediaPath = `${apiPathname}/media/**`.replace(/\/+/, '/');
const normalizedMediaPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com', // عشان خرائط جوجل لو بتستخدم صور منها
      },
	   {
        protocol: 'https',
        hostname: 'images.unsplash.com', // عشان خرائط جوجل لو بتستخدم صور منها
      },
	  {
        protocol: 'https',
        hostname: '**',        // لو الصور على كلاود (S3 مثلاً)
      },
    ],
	unoptimized: true,
  },
  // ... بقية الإعدادات
};

export default nextConfig;
