import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingChatBubble from '@/components/common/FloatingChatBubble';
import RecentSalesPopup from '@/components/social/RecentSalesPopup';
import FloatingWhatsAppPill from '@/components/common/FloatingWhatsAppPill';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#24332C',
};

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ELVORA | Fine Jewellery & Modern Keepsakes',
  description:
    'Discover ELVORA: timeless luxury jewellery, illuminated couple touch bracelets, celestial keepsakes, and fine silver & gold craftsmanship.',
  keywords: [
    'luxury jewellery',
    'couple bracelets',
    'touch distance bracelets',
    'fine jewelry',
    'ELVORA',
    'pearl earrings',
    'heart sword necklace',
  ],
  authors: [{ name: 'ELVORA Fine Jewellery' }],
  metadataBase: new URL('https://elvora.com'),
  openGraph: {
    title: 'ELVORA | Fine Jewellery & Modern Keepsakes',
    description: 'Timeless luxury jewellery and modern celestial couple bracelets.',
    url: 'https://elvora.com',
    siteName: 'ELVORA',
    images: [
      {
        url: '/images/products/touch-distance-bracelet/hero.jpg',
        width: 1024,
        height: 1024,
        alt: 'ELVORA Fine Jewellery',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo-circle.png',
    shortcut: '/favicon.ico',
    apple: '/images/favicon.png',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://elvora.com/#organization',
      name: 'ELVORA',
      url: 'https://elvora.com',
      logo: 'https://elvora.com/images/logo-circle.png',
      description: 'Premium fine jewellery and illuminated couple touch bracelets.',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'concierge@elvora.com',
        contactType: 'customer service',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://elvora.com/#website',
      url: 'https://elvora.com',
      name: 'ELVORA Fine Jewellery',
      publisher: {
        '@id': 'https://elvora.com/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-white text-[#181818] font-sans antialiased min-h-screen flex flex-col selection:bg-[#24332C] selection:text-white">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <AnnouncementBar />
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
                <FloatingChatBubble />
                <FloatingWhatsAppPill />
                <RecentSalesPopup />
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
