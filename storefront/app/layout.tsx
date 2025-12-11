import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
})

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#6366f1',
}

export const metadata: Metadata = {
    title: 'Constructor - E-commerce for Fashion & Beauty',
    description: 'The best e-commerce platform for fashion, beauty, and personal care businesses',
    keywords: ['e-commerce', 'fashion', 'beauty', 'online store', 'shopping'],
    authors: [{ name: 'Constructor' }],
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Constructor',
    },
    openGraph: {
        title: 'Constructor - E-commerce for Fashion & Beauty',
        description: 'The best e-commerce platform for fashion, beauty, and personal care businesses',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className="font-sans">
                {children}
            </body>
        </html>
    )
}
