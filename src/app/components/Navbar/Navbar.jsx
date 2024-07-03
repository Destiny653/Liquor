'use client';
import React, { useState } from 'react';
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


    const [mouseUp, setMouseUp] = useState(false)

    return (
        <div>
            <nav  className={`${mouseUp == true && "true"}`}>
                <ul style={navstyle}>
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
