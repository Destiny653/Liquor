import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "../../context/AuthContext";
import Footer from "./components/Footer/Footer";
import SearchProvider from "../../context/SearchContext";
import MsgBtn from "./components/MsgBtn/MsgBtn";
import { CartProvider } from "../../context/CartContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
            <SearchProvider>
              <CartProvider>
                <Navbar />
                {children}
                <MsgBtn />
                <Footer />
              </CartProvider>
            </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
