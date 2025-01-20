'use client'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillMessage } from "react-icons/ai";
import Contact from '@/app/contact/page';
import './msgbtn.css'
import { SearchContext } from '../../../../context/SearchContext';


export default function MsgBtn() {

  const {msgBtn, setMsgBtn} =useContext(SearchContext)
    const [effect, setEffect]= useState(false)
    console.log(effect);
    useEffect(() => {
 
        if (effect) {
          document.querySelector('.chatBtn').classList.add('activeMsg');
        } else {
          document.querySelector('.chatBtn').classList.remove('activeMsg');
        }

      }, [effect]) // only re-run effect if message changes
  
  return (
    <div className='max-screen-msg-btn'>
      { msgBtn && <Contact/>}
      <div onClick={() => !msgBtn ? setMsgBtn(true) : setMsgBtn(false)} className={`btnActive fixed right-[20px] bottom-[25px] cursor-pointer text-white chatBtn`}> <AiFillMessage className="inline msgBtn" size={25} /> Contact us</div>
    </div>
  )
}
