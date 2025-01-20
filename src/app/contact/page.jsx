'use client'
import React, { useContext, useRef, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import emailjs from '@emailjs/browser';
import './contact.css';


const Contact = () => {

    const form = useRef()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [text, setText] = useState('')
    const [phone, setPhone] = useState('')
   

    const handleEmail = (e) => {
        
        setName('')
        setEmail('')
        setText('')
        setPhone('')

        e.preventDefault()
        emailjs.sendForm('service_yok3ejb', 'template_njb1bre', form.current, {
            publicKey: 'ie3XvRbY2rSalRh40',
        }).then((res) => {
            console.log(res);
            notyf.success('Email sent succesfully!!')
        }).catch(err => {
            console.log(err);
            notyf.error('Please fill the form!!')
        })

        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        })
    }


    return (
        <>
            <div className={`container-small`} >
                <form className={`form-small relative`} ref={form} onSubmit={handleEmail} action='' method='post'>
                <h1 className='border-[#16124e] relative left-[50%] pb-[10px] text-[24px] font-[500]'>Talk with us</h1>
                    <label className={`lebel-small`}>
                        <input className={`input-small`} value={name} type="text" name='name'  placeholder="Name" onChange={e=>setName(e.target.value)} />
                    </label>
                        <label className={`lebel-small w-full`}>
                            <input className={`input-small w-full`} value={email} type="email" name='email'  placeholder="ex = name@gmail.com" onChange={e=>setEmail(e.target.value)}/>
                        </label>
                        <label className={`lebel-small w-full`}>
                            <input className={`input-small`} value={phone} type="tel" name='phone'  placeholder='Phone number' onChange={e=>setPhone(e.target.value)}/>
                        </label>
                    <label className={`lebel-small`}>
                        <textarea className={`input-samll px-4 border border-[#16124e] text-[15px]`} value={text} name="message" id="textArea"  cols="6" rows="4" placeholder='Your message' onChange={e=>setText(e.target.value)}></textarea>
                    </label>
                    <button className={`button-small`}>Send</button>
                </form>
            </div>
        </>
    )
}

export default Contact
