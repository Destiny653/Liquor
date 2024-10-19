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
    const { setSignIn } = useContext(SearchContext)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loader, setLoader] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)

        //create an instance of Notyf
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });  

        if (email) {
            // validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setLoader(false)
                notyf.error('Invalid email address');
                return;
            }
            //set email to local storage
            localStorage.setItem('email', email);

            // validate password
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                setLoader(false)
                notyf.error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
                return;
            }

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
                    setLoader(false)
                    notyf.error('Error:' + errorData.message);
                    return;
                }
                const data = await res.json();
                console.log(data)
                setLoader(false)
                notyf.success('Registration successful!');
                navigation.push('/login');
            } catch (error) {
                setLoader(false)
                notyf.error('Registration failed!' + error.message);
                console.log(error);
            }
        }
    };

    const Load = () => {
        return (
            <div className='loader-p h-[100%] w-full z-10 bg-[#c6c5ec65] fixed top-0'>
                <div className="loader-con">
                    <section className='loader-i'></section>
                </div>
            </div>
        )
    }


    return (
        <div className='nav-obscure-view'>
            {
                loader ? <Load /> :  ""
            }
            <div className='register-bg flex justify-center items-center box-border py-11'>
                <div className={`sub-p flex justify-evenly gap-8 items-center bg-white box-border p-5 overflow-hidden rounded-[8px] `} >
                    <div className='register-img w-full overflow-hidden'>
                        <Image className='h-full w-full' src='/images/royal.jpg' alt='whisky bottle demo' width={500} height={500} />
                    </div>
                    <div className='w-2/4 form-part '>
                        <h2 className={` text-3xl header singup-title font-[600]`}>Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                            <div className=' mb-6 flex flex-col'>
                                <label htmlFor="username" className='pb-1 text-[14px] font-[600]'>
                                    Name
                                </label>
                                <input type="text" value={username} name='text' placeholder='Enter username...' className='outline-0 form-control py-[6px] rounded-[4px] px-4 border' onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div className=' mb-3 flex flex-col'>
                                <label htmlFor="email" className='pb-1 text-[14px] font-[600]'>
                                    Email
                                </label>
                                <input type="email" value={email} name='email' placeholder='Enter email...' className='outline-0 form-control py-[6px] rounded-[4px] px-4 border' onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className=' mb-6 flex flex-col'>
                                <label htmlFor="password" className='pb-1 text-[14px] font-[600]'>
                                    Password
                                </label>
                                <input type="password" value={password} name='password' placeholder='*******' className='outline-0 form-control py-[6px] rounded-[4px] px-4 border' onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type='submit' className='btn btn-success w-80 text-[15px]'>Sign Up</button>
                        </form>
                        <p className='text-[12px] text-[blue] cursor-pointer hover:underline mb-2 mt-1'>Already have an account?</p>
                        <button className='btn  btn-default text-[15px]'>
                            <Link href='/login'>Login</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
