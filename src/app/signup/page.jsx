'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useContext } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import './signup.css';
import Image from 'next/image';
import { SearchContext } from '../../../context/SearchContext';

export default function Page() {

    const navigation = useRouter()
    const {setSignIn} = useContext(SearchContext)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignIn(email)
        //create an instance of Notyf
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });
 
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                notyf.error('Error:'+ errorData.message);
                return;
            }

            const data = await res.json();
            notyf.success('Registration successful!');
            navigation.push('/login');
        }catch(error){
            notyf.error('Registration failed!'+ error.message);
            console.log(error);
        }
    };


    return (
        <div>
            <div className='register-bg flex justify-center items-center box-border py-11'>
                <div className={`sub-p flex justify-evenly gap-8 items-center bg-white box-border p-9 overflow-hidden rounded-3xl `} >
                    <div className='register-img w-full overflow-hidden'>
                        <Image className='h-full w-full' src='/images/royal.jpg' alt='whisky bottle demo' width={500} height={500} />
                    </div>
                    <div className='w-2/4 form-part '>
                        <h2 className={` text-3xl header singup-title `}>Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                            <div className=' mb-6 flex flex-col'>
                                <label htmlFor="username" className='singup-label pb-1'>
                                    Name
                                </label>
                                <input type="text" value={username} name='text' placeholder='Enter username...' className='outline-0 form-control py-3 rounded-3xl px-4 border' onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div className=' mb-3 flex flex-col'>
                                <label htmlFor="email" className='singup-label pb-1'>
                                    Email
                                </label>
                                <input type="email" value={email} name='email' placeholder='Enter email...' className='outline-0 form-control py-3 rounded-3xl px-4 border' onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className=' mb-6 flex flex-col'>
                                <label htmlFor="password" className='singup-label pb-1'>
                                    Password
                                </label>
                                <input type="password" value={password} name='password' placeholder='*******' className='outline-0 form-control py-3 rounded-3xl px-4 border' onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type='submit' className='btn btn-success w-80 bg-[rgba(255, 174, 0, 0.904)] '>Sign Up</button>
                        </form>
                        <p className='singup-label mb-2 mt-1'>Already have an account?</p>
                        <button className='btn  btn-default'>
                            <Link href='/login'>Login</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
