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
      {
        protocol: 'https',
        hostname: 'faixa-rosa.s3.us-central-1.wasabisys.com',
      },
    ],
  },
};

export default nextConfig;
