'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer/Footer';
import BottomNav from './BottomNav/BottomNav';
import CartSlider from './CartSlider/CartSlider';
import MsgBtn from './MsgBtn/MsgBtn';
import Navbar from './Navbar/Navbar';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    return (
        <>
            {!isDashboard && <Navbar />}
            {children}
            {!isDashboard && <CartSlider />}
            {!isDashboard && <MsgBtn />}
            {!isDashboard && <Footer />}
            {!isDashboard && <BottomNav />}
        </>
    );
}
