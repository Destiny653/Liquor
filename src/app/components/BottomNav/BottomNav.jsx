'use client'
import React, { useContext } from 'react'
import { ChatCircle, ShoppingCart, SignIn, Storefront, House } from "@phosphor-icons/react";
import { SearchContext } from '../../../../context/SearchContext';
import './bottom.css'
import { useRouter } from 'next/navigation';

export default function BottomNav() {
    const { msgBtn, setMsgBtn } = useContext(SearchContext)
    const icons = [
        {
            icon: <ChatCircle size={28} weight="regular" />,
            title: 'message'
        },
        {
            icon: <ShoppingCart size={28} weight="regular" />,
            path: '/cart',
            title: 'cart'
        },
        {
            icon: <House size={28} weight="regular" />,
            path: '/',
            title: 'home'
        },
        {
            icon: <SignIn size={28} weight="regular" />,
            path: '/signup',
            title: 'register'
        },
        {
            icon: <Storefront size={28} weight="regular" />,
            path: '/shop',
            title: 'shop'
        },
    ]
    const navigation = useRouter()

    return (
        <div className='icon-parent'>
            {icons.map((icon, index) => (
                <div key={index}
                    onClick={() => {
                        icon.path &&
                        navigation.push(icon.path);
                        icon.title == 'message' && (msgBtn ? setMsgBtn(false) : setMsgBtn(true))
                    }}
                    className={`icon relative w-[35px] h-[35px] rounded-full flex items-center justify-center`}>
                    {icon.icon}
                    <p className='active-title'>{icon.title}</p>
                </div>
            ))}
        </div>
    )
}
