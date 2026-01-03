import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "../../context/AuthContext";
import SearchProvider from "../../context/SearchContext";
import { CartProvider } from "../../context/CartContext";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata = {
  title: "LiquorLuxx | Premium Spirits & Rare Bourbon Collection",
  description: "Discover the world's finest collection of premium whiskey, rare bourbon, and exclusive spirits. Free shipping on orders over $500. Authenticity guaranteed.",
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
