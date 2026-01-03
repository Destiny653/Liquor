'use client'
import React, { useContext, useEffect, useState } from 'react'
import { PiChatTextFill } from "react-icons/pi";
import ChatBot from '../ChatBot/ChatBot';
import './msgbtn.css'
import { SearchContext } from '../../../../context/SearchContext';


export default function MsgBtn() {

  const { msgBtn, setMsgBtn } = useContext(SearchContext)
  const [effect, setEffect] = useState(false)
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
      {msgBtn && <ChatBot onClose={() => setMsgBtn(false)} />}
      <div
        onClick={() => setMsgBtn(!msgBtn)}
        className={`cursor-pointer chatBtn ${msgBtn ? 'hide-btn' : ''}`}
      >
        <PiChatTextFill className="inline msgBtn" size={24} />
        <span>Concierge</span>
      </div>
    </div>
  )
}
