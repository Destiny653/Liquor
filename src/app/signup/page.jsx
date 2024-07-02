'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useContext } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import './signup.css';
import Image from 'next/image';

export default function Page() {

    const navigation = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        //create an instance of Notyf
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            if (res.status === 201) {
                navigation.push("/login?success=Account has been created");
                notyf.success('Account has been created')
            } else if (res.status === 404) {
                notyf.error('User already exists')
            } else {
                notyf.error('Please fill out the form')
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div className='relative'>
            <div className='register-bg flex justify-center items-center box-border py-11'>
                <div className={`sub-p flex justify-evenly gap-8 items-center bg-white box-border p-9 overflow-hidden rounded-3xl `} >
                    <div className='register-img w-full overflow-hidden'>
                        <Image className='h-full w-full' src='https://th.bing.com/th/id/OIP.WQQyJ18HcoBE92znqYGrgQAAAA?rs=1&pid=ImgDetMain' alt='food image' width={400} height={400} />
                    </div>
                    <div className='w-2/4 form-part '>
                        <h2 className={` text-3xl relative header`}>Register</h2>
                        <form onSubmit={handleSubmit}>
                            <div className=' mb-6 flex flex-col'>
                                <label htmlFor="name" className=' pb-1'>
                                    Name
                                </label>
                                <input type="text" value={name} name='text' placeholder='Enter name...' className=' form-control py-3 rounded-3xl px-4 border' onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className=' mb-3 flex flex-col'>
                                <label htmlFor="email" className=' pb-1'>
                                    Email
                                </label>
                                <input type="email" value={email} name='email' placeholder='Enter email...' className=' form-control py-3 rounded-3xl px-4 border' onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className=' mb-6 flex flex-col'>
                                <label htmlFor="password" className=' pb-1'>
                                    Password
                                </label>
                                <input type="password" value={password} name='password' placeholder='*******' className=' form-control py-3 rounded-3xl px-4 border' onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type='submit' className='btn btn-success w-80 bg-orange-500 '>Sign Up</button>
                        </form>
                        <p className=' mb-2 mt-1'>Already have an account</p>
                        <button className='btn  btn-default border bg-slate-200 '>
                            <Link href='/login'>Login</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
