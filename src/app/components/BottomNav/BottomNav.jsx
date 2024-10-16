'use client'
import React, { useContext } from 'react'
import { AiFillMessage } from 'react-icons/ai';
import { SearchContext } from '../../../../context/SearchContext';
import './bottom.css'

export default function BottomNav() {
    const { msgBtn, setMsgBtn } = useContext(SearchContext)
    return (
        <div className='icon-parent'>
            <div className="icon w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center"></div>
            <div className="icon w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center"></div>
            <div className="icon w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center"></div>
            <div onClick={() => !msgBtn ? setMsgBtn(true) : setMsgBtn(false)} className="icon w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center"><AiFillMessage className="inline msgBtn" size={25} /></div>
        </div>
    )
}
