'use client'
import React, { useContext, useRef, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import emailjs from '@emailjs/browser';
import './contact.css';


const Page = () => {

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
                <form className={`form-small`} ref={form} onSubmit={handleEmail} action='' method='post'>
                    <label className={`lebel-small`}>
                        <input className={`input-small`} value={name} type="text" name='name'  placeholder="Name" />
                    </label>
                        <label className={`lebel-small w-full`}>
                            <input className={`input-small w-full`} value={email} type="email" name='email'  placeholder="ex = name@gmail.com" />
                        </label>
                        <label className={`lebel-small w-full`}>
                            <input className={`input-small`} value={phone} type="tel" name='phone'  placeholder='Phone number' />
                        </label>
                    <label className={`lebel-small`}>
                        <textarea className={`input-samll`} value={text} name="message" id="textArea"  cols="6" rows="4" placeholder='Your message'></textarea>
                    </label>
                    <button className={`button-small`}>Send</button>
                </form>
            </div>
        </>
    )
}

export default Page
