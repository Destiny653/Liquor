import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "../../context/AuthContext";
import SearchProvider from "../../context/SearchContext";
import { CartProvider } from "../../context/CartContext";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata = {
  metadataBase: new URL('https://liquorluxx.com'),
  title: {
    default: "LiquorLuxx | Premium Spirits, Rare Bourbon & Global Whiskey Collection",
    template: "%s | LiquorLuxx"
  },
  description: "Experience LiquorLuxx, the premier global destination for luxury spirits and rare bourbon. Discover expert-curated collections of the world's finest whiskeys, vintage scotches, and exclusive limited editions. Join a community of connoisseurs and collectors today.",
  keywords: [
    "premium spirits",
    "rare bourbon",
    "buy whiskey online",
    "Pappy Van Winkle",
    "W.L. Weller",
    "Buffalo Trace collection",
    "Scotch whisky",
    "Japanese whisky",
    "exclusive alcohol",
    "whiskey club",
    "bourbon secondary market",
    "luxury liquor",
    "spirit certifications",
    "whiskey tasting guides",
    "vintage spirits",
    "rare cognac",
    "tequila reserve",
    "liquor gift sets",
    "premium gin",
    "artisanal vodka",
    "limited edition spirits",
    "whiskey investment",
    "bourbon hunting",
    "online liquor store",
    "global spirit shipping",
    "curated spirits",
    "rare drinks",
    "LiquorLuxx",
    "LiquorLuxx bourbon",
    "LiquorLuxx premium whiskey",
    "distillery releases",
    "barrel proof bourbon",
    "single malt scotch",
    "whiskey reviews",
    "top shelf liquor",
    "affordable luxury spirits"
  ],
  authors: [{ name: "LiquorLuxx Team" }],
  creator: "LiquorLuxx",
  publisher: "LiquorLuxx",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://liquorluxx.com",
    siteName: "LiquorLuxx",
    title: "LiquorLuxx – Transform Your Bar with World-Class Spirits",
    description: "Access world-class whiskeys, rare collectibles, and spirits recognized by connoisseurs worldwide. Start your collection with LiquorLuxx today!",
    images: [{
      url: "/images/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "LiquorLuxx Premium Spirits Platform"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiquorLuxx – Global Premium Spirits Platform",
    description: "Elevate your collection with whiskeys and bourbons recognized by experts worldwide",
    images: ["/images/og-image.jpg"],
    creator: "@liquorluxx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png'
  },
  alternates: {
    canonical: 'https://liquorluxx.com'
  },
  category: 'ecommerce'
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
