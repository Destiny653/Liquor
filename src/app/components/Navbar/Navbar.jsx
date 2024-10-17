'use client';
import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import Link from 'next/link';
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from 'next/navigation';
import { SearchContext } from '../../../../context/SearchContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Display from '../SearchDisplay/Display';

export default function Navbar() {

    const { setSearchVal, setSearchInp, handleSearch } = useContext(SearchContext)
    const { data: session } = useSession()
    console.log(session);


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
            title: 'Login',
            path: '/login'
        },
        {
            title: 'Register',
            path: '/signup'
        },
        {
            title: 'Dashboard',
            path: '/dashboard/posts'
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
        if (currentScrollY > lastScrollY) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const [query, setQuery] = useState('');
    // setSearchInp(query)
    handleSearch(query)
    console.log(query);
    const fetchFromAPIs = async (title) => {
        const apis = [
            `/api/posts`
        ];

        const fetchPromises = apis.map(api => fetch(api).then(res => res.json()));

        const results = await Promise.all(fetchPromises);
        console.log(results);

        // Flatten the array of results and filter based on the title
        const filteredResults = results.flat().filter(product =>
            product.title.toLowerCase().includes(title.toLowerCase())
        );
        console.log(filteredResults);

        return filteredResults;
    };

    useEffect(() => {
        fetchFromAPIs(query).then(results => setSearchVal(results));
    }, [query]); // Trigger the fetchFromAPIs function when the query changes




    return (
        <div  style={{ position: 'fixed', top: '0', width: '99.9%', zIndex: '10', transition: 'transform 0.3s ease', transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
            <nav className="bg-white">
                <section id='first-nav' className="first-nav nav-search-p z-20">
                    <div className="n-search-1 font-bold text-2xl nav-logo ">LOGO</div>
                    <label className='n-search-2 relative grid place-items-center w-[60%]'>
                        <input className="nav-search-bar" type="text" name="text" placeholder="What our you looking for?" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Display />
                    </label>
                    <section className="nav-search-3 flex justify-center items-center gap-2">
                        <div className="nav-user-img">
                            <Image className='w-full h-full rounded-full ' src={session?.user.image} alt="user-icon" width={100} height={100} />
                        </div>
                        <h2>{session?.user.name}</h2>
                    </section>
                </section>
                <section id='second-nav' className=" nav-search-p box-border pt-[10px] z-20">
                    <div className='second-nav-ch2 flex justify-between w-full'>
                        <div className="n-search-1 font-bold text-2xl nav-logo ">LOGO</div>
                        <section className="n-search-3 flex justify-center items-center gap-2">
                            <h2>{session?.user.name}</h2>
                            <div className="nav-user-img">
                                <Image  src={session?.user.image} alt="user-icon" width={100} height={100} className='w-full h-full rounded-full' />
                            </div>
                        </section>
                    </div>
                    <label className='n-search-2 relative grid place-items-center w-[100%]'>
                        <input className="nav-search-bar rounded-[25px]" type="text" name="text" placeholder="What our you looking for?" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Display />
                    </label>
                </section>
                <section className='nav-links flex justify-center items-center pt-4'>
                    <ul  
                        className="nav-item-p"
                        data-aos-offset="500"
                        data-aos-duration="100"
                        data-aos="fade-down"
                    >
                        {
                            nav.map((item, index) => {
                                return (
                                    <li className='nav-child' key={index}>
                                        <Link href={item.path}>{item.title}</Link>
                                    </li>
                                )
                            })
                        } 
                    </ul>
                </section>
            </nav>
        </div>
    )
}
