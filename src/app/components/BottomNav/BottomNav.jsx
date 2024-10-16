'use client'
import React, { useContext } from 'react'
import { AiFillMessage } from 'react-icons/ai';
import { HiOutlineShoppingCart } from "react-icons/hi2";
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
            <div onClick={()=>navigation.push('/cart')} className="icon w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center"><HiOutlineShoppingCart className="inline msgBtn" size={25} /></div>
            <div className="icon w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center"></div>
            <div onClick={()=>navigation.push('/')} className="icon w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center"><TfiHome size={28} className='text-[#000000]' /></div>
            <div className="icon w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center"></div>
            <div onClick={() => !msgBtn ? setMsgBtn(true) : setMsgBtn(false)} className="icon w-[35px] h-[35px] rounded-full bg-white flex items-center justify-center"><AiFillMessage className="inline msgBtn" size={25} /></div>
        </div>
    )
}
