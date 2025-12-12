const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
                }
            }
        },
        {
            urlPattern: /^https:\/\/via\.placeholder\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'placeholder-images',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-font-assets',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                }
            }
        },
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-image-assets',
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /\/_next\/image\?url=.+$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'next-image',
                expiration: {
                    maxEntries: 64,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /\.(?:js)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-js-assets',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /\.(?:css|less)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-style-assets',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                }
            }
        },
        {
            urlPattern: /^https:\/\/localhost:3001\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 16,
                    maxAgeSeconds: 5 * 60 // 5 minutes
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }
    ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            }
        ],
        formats: ['image/avif', 'image/webp'],
    },
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://jerson-backend.vercel.app/api/:path*',
            },
        ];
    },
}

module.exports = withPWA(nextConfig)
