'use client'
import React, { useContext } from 'react'
import { AiOutlineMessage } from "react-icons/ai";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoIosLogIn } from "react-icons/io";
import { BsShop } from "react-icons/bs";
import { SearchContext } from '../../../../context/SearchContext';
import './bottom.css'
import Contact from '@/app/contact/page';
import { TfiHome } from 'react-icons/tfi';
import { useRouter } from 'next/navigation';

export default function BottomNav() {
    const { msgBtn, setMsgBtn } = useContext(SearchContext)
    const icons = [
        {
            icon: <AiOutlineMessage size={25} />, 
            title: 'message'
        },
        {
            icon: <HiOutlineShoppingCart size={25} />,
            path: '/cart',
            title: 'cart'
        },
        {
            icon: <TfiHome size={28} />,
            path: '/',
            title: 'home'
        },
        {
            icon: <IoIosLogIn size={25} />,
            path: '/signup',
            title: 'register'
        },
        {
            icon: <BsShop size={25} />,
            path: '/shop',
            title:'shop'
        },
    ]
    const navigation = useRouter()
    
    return (
        <div className='icon-parent'>
            {msgBtn && <Contact />}
            {icons.map((icon, index) => (
                <div key={index}  
                onClick={()=>{ icon.path && 
                navigation.push(icon.path); 
                icon.title == 'message' && (msgBtn ? setMsgBtn(false) : setMsgBtn(true)) }} 
                className={`icon relative w-[35px] h-[35px] rounded-full flex items-center justify-center`}>
                    {icon.icon}
                    <p className='active-title'>{icon.title}</p>
                </div>
            ))}
        </div>
    )
}
