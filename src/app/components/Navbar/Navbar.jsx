'use client';
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import Link from 'next/link';
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from 'next/navigation';

export default function Navbar() {

    useEffect(() => {

        AOS.init({
            duration: 500,
        });
    }), []

    const nav = [
        {
            title: 'Home',
            path: '/'
        },
        {
            title: 'About',
            path: '/about'
        },
        {
            title: 'Shop',
            path: '/shop'
        },
        {
            title: 'Cart',
            path: '/cart'
        },
        {
            title: 'Checkout',
            path: '/checkout'
        },
        {
            title: 'Account',
            path: '/account'
        },
        {
            title: 'Login',
            path: '/login'
        },
        {
            title: 'Sign Up',
            path: '/signup'
        }
    ]
    const navstyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        width: '100%',
        height: '50px',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '18px'
    };

    const [option, setOption] = useState('');
    const navigation = useRouter()

    if (option) {
        navigation.push(`/dashboard/posts`)
        setOption('')
    }

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY){
            setIsVisible(false);
        }else{
            setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
    }

    useEffect(()=>{
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    },[lastScrollY]);


    return (
        <div>
            <nav>
                <section className="bg-black py-2 flex items-center justify-center" >
                    <h3 className=" text-white text-sm">Join Our Bottled & Boxed Club: Free Shipping on Orders $99+</h3>
                </section>
                <section className="nav-search-p">
                    <div className="font-bold text-2xl nav-logo ">LOGO</div>
                    <input className="nav-search-bar" type="text" name="text" placeholder="What our you looking for?" />
                    <section className="flex justify-center items-center gap-2">
                        <div className="nav-user-img"></div>
                        <h2>Hello User</h2>
                    </section>
                </section>

                <ul style={{position: 'fixed', top: '0', width: '100%', zIndex: '10' ,transition: 'transform 0.3s ease', transform: isVisible?'translateY(0)': 'translateY(-100%)'}}
                className="nav-item-p"
                    data-aos-offset="500"
                    data-aos-duration="100"
                    data-aos="fade-down"
                >
                    {
                        nav.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link href={item.path}>{item.title}</Link>
                                </li>
                            )
                        })
                    }

                    <li className='dashHoveI'>Dashboard
                        <div className='dashHover box-border'>
                            <select className='selectItem create-input w-full outline-none text-black  py-2 px-3' value={option} required onChange={(e) => setOption(e.target.value)}>
                                <option value="">Select option</option>
                                <option value="balton">Balton</option>
                                <option value="buffalo">Buffalo</option>
                                <option value="pappy">Pappy</option>
                                <option value="penelope">Penelope</option>
                                <option value="weller">Weller</option>
                                <option value="yamazaki">Yamazaki</option>
                            </select>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
