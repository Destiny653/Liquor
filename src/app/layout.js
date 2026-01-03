import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "../../context/AuthContext";
import Footer from "./components/Footer/Footer";
import SearchProvider from "../../context/SearchContext";
import MsgBtn from "./components/MsgBtn/MsgBtn";
import { CartProvider } from "../../context/CartContext";
import BottomNav from "./components/BottomNav/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LiquorLuxx | Premium Spirits & Rare Bourbon Collection",
  description: "Discover the world's finest collection of premium whiskey, rare bourbon, and exclusive spirits. Free shipping on orders over $500. Authenticity guaranteed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Navbar />
              {children}
              <MsgBtn />
              <Footer />
              <BottomNav />
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
