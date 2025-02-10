/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
env: {
  NEXTAUTH_URL: 'https://faixarosa.com', // URL do seu site
},
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
