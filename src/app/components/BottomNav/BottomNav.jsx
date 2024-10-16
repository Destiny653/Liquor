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
    const navigation = useRouter()
    return (
        <div className='icon-parent'>
            {msgBtn && <Contact />}
            <div onClick={()=>navigation.push('/cart')} className="icon w-[35px] h-[35px] rounded-full flex items-center justify-center"><HiOutlineShoppingCart className="inline msgBtn" size={25} /></div>
            <div onClick={()=>navigation.push('/shop')} className="icon w-[35px] h-[35px] rounded-full flex items-center justify-center"><BsShop className="inline msgBtn" size={25}/></div>
            <div onClick={()=>navigation.push('/')} className="icon w-[40px] h-[40px] rounded-full flex items-center justify-center"><TfiHome size={28} /></div>
            <div onClick={()=>navigation.push('/signup')} className="icon w-[35px] h-[35px] rounded-full flex items-center justify-center"><IoIosLogIn className="inline msgBtn" size={25} /></div>
            <div onClick={() => !msgBtn ? setMsgBtn(true) : setMsgBtn(false)} className="icon w-[35px] h-[35px] rounded-full flex items-center justify-center"><AiOutlineMessage  className="inline msgBtn" size={25} /></div>
        </div>
    )
}
