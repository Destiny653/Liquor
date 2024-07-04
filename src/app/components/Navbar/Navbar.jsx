// 'use client';
import React from 'react';
import './Navbar.css'
import Link from 'next/link';

export default function Navbar() {

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
            title: 'Contact',
            path: '/contact'
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

                <ul className="nav-item-p">
                    {
                        nav.map((item, index) => {
                            return (
                                <li key={index}>
                                    <a href={item.path}>{item.title}</a>
                                </li>
                            )
                        })
                    }
                    <li className='dashboard-p'>
                        Dashboard
                        <ul className='dashboard-ch'>
                            <Link href='/dashboard/posts/create'>
                                <li>Upload Product</li>
                            </Link>
                            <Link href='/dashboard/posts'>
                                <li>Products</li>
                            </Link>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
