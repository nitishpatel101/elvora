import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

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
  title: 'ELVORA | Luxury Jewellery & Fine Accessories',
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
  authors: [{ name: 'ELVORA Haute Joaillerie' }],
  metadataBase: new URL('https://elvora.com'),
  openGraph: {
    title: 'ELVORA | Luxury Jewellery & Fine Accessories',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#F8F6F2] text-[#171717] font-sans antialiased min-h-screen flex flex-col selection:bg-[#B89A69] selection:text-white">
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <AnnouncementBar />
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
                <CartDrawer />
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
