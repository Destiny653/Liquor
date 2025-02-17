'use client';
import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css';
import Link from 'next/link';
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from 'next/navigation';
import { SearchContext } from '../../../../context/SearchContext';
import { useSession } from 'next-auth/react';
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
            title: 'Shop',
            path: '/shop'
        },
        {
            title: 'Cart',
            path: '/cart'
        }, 
        {
            title: 'Login',
            path: '/login'
        }, 
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
    const [currentScroll, setCurrentScroll] = useState(0)

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setCurrentScroll(currentScrollY)

        if (currentScrollY < 150) {
            setIsVisible(true)
            console.log("True")
        } else {

            if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        }
    }
    console.log(lastScrollY)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const [query, setQuery] = useState('');
    // setSearchInp(query)
    // handleSearch(query)
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
            product?.title?.toLowerCase().includes(title.toLowerCase())
        );
        console.log(filteredResults);

        return filteredResults;
    };

    useEffect(() => {
        fetchFromAPIs(query).then(results => setSearchVal(results));
    }, [query]); // Trigger the fetchFromAPIs function when the query changes




    return (
        <div style={{ position: (currentScroll > 150) && 'fixed', top: '0', width: '99.9%', zIndex: '10', transition: 'transform 0.3s ease', transform: isVisible ? 'translateY(0)' : 'translateY(-100%)' }}>
            <nav className="bg-white">
                <section id='first-nav' className="z-20 nav-search-p first-nav">
                    <div className="n-search-1 font-bold text-2xl nav-logo">LOGO</div>
                    <label className='relative place-items-center grid w-[60%] n-search-2'>
                        <input className="nav-search-bar" type="text" name="text" placeholder="What our you looking for?" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Display />
                    </label>
                    <section className="flex justify-center items-center gap-2 nav-search-3">
                        <div className="nav-user-img">
                            <img className='rounded-full w-full h-full' src={session ? session.user?.image : null} alt="user-icon" width={100} height={100} />
                        </div>
                        <h2>{session?.user.name}</h2>
                    </section>
                </section>
                <section id='second-nav' className="z-20 box-border pt-[10px] nav-search-p">
                    <div className='flex justify-between w-full second-nav-ch2'>
                        <div className="n-search-1 font-bold text-2xl nav-logo">LOGO</div>
                        <section className="flex justify-center items-center gap-2 n-search-3">
                            <h2>{session?.user.name}</h2>
                            <div className="nav-user-img">
                                <img src={session ? session.user?.image : null} alt="user-icon" width={100} height={100} className='rounded-full w-full h-full' />
                            </div>
                        </section>
                    </div>
                    <label className='relative place-items-center grid w-[100%] n-search-2'>
                        <input className="rounded-[25px] nav-search-bar" type="text" name="text" placeholder="What our you looking for?" value={query} onChange={(e) => setQuery(e.target.value)} />
                        <Display />
                    </label>
                </section>
                <section className='flex gap-[15px] pt-4 nav-links'>
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
