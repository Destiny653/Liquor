'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer/Footer';
import BottomNav from './BottomNav/BottomNav';
import CartSlider from './CartSlider/CartSlider';
import MsgBtn from './MsgBtn/MsgBtn';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    return (
        <>
            {children}
            {!isDashboard && <CartSlider />}
            {!isDashboard && <MsgBtn />}
            {!isDashboard && <Footer />}
            {!isDashboard && <BottomNav />}
        </>
    );
}
