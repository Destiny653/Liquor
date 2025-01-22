'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useContext } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import './signup.css'; 
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
            <div className='top-0 z-10 fixed bg-[#c6c5ec65] w-full h-[100%] loader-p'>
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
            <div className='box-border flex justify-center items-center py-11 register-bg'>
                <div className={`sub-p flex justify-evenly gap-8 items-center bg-white box-border p-5 overflow-hidden rounded-[8px] `} >
                    <div className='w-full overflow-hidden register-img'>
                        <img className='w-full h-full' src='/images/royal.jpg' alt='whisky bottle demo' width={500} height={500} />
                    </div>
                    <div className='form-part w-2/4'>
                        <h2 className={` text-3xl header singup-title font-[600]`}>Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col mb-6'>
                                <label htmlFor="username" className='pb-1 font-[600] text-[14px]'>
                                    Name
                                </label>
                                <input type="text" value={username} name='text' placeholder='Enter username...' className='form-control px-4 py-[6px] border rounded-[4px] outline-0' onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label htmlFor="email" className='pb-1 font-[600] text-[14px]'>
                                    Email
                                </label>
                                <input type="email" value={email} name='email' placeholder='Enter email...' className='form-control px-4 py-[6px] border rounded-[4px] outline-0' onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className='flex flex-col mb-6'>
                                <label htmlFor="password" className='pb-1 font-[600] text-[14px]'>
                                    Password
                                </label>
                                <input type="password" value={password} name='password' placeholder='*******' className='form-control px-4 py-[6px] border rounded-[4px] outline-0' onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <button type='submit' className='w-80 text-[15px] btn btn-success'>Sign Up</button>
                        </form>
                        <p className='mt-1 mb-2 text-[12px] text-[blue] hover:underline cursor-pointer'>Already have an account?</p>
                        <button className='text-[15px] btn btn-default'>
                            <Link href='/login'>Login</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
