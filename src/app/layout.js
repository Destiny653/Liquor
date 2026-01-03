import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "../../context/AuthContext";
import SearchProvider from "../../context/SearchContext";
import { CartProvider } from "../../context/CartContext";
import LayoutWrapper from "./components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  title: "LiquorLuxx | Premium Spirits & Rare Bourbon Collection",
  description: "Discover the world's finest collection of premium whiskey, rare bourbon, and exclusive spirits. Free shipping on orders over $500. Authenticity guaranteed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning={true}>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Navbar />
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
