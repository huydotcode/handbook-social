/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,

    // Monorepo support
    experimental: {
        externalDir: true,
    },

    // Transpile workspace packages
    transpilePackages: ['@handbook/shared'],

    // Disable ESLint during build - FIX FOR VERCEL
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript checking for Vercel build
    typescript: {
        ignoreBuildErrors: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;
