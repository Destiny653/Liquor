'use client'
import React, { useContext, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import './login.css'
import { FcGoogle } from 'react-icons/fc'
import { useRouter } from 'next/navigation'
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'
import Link from 'next/link'

const Page = () => {

    const navigation = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const [getEmail, setGetEmail] = useState('')



    const { data: session } = useSession()
    console.log(session)

    if (session) { 
        let reqPass = null;
        if (typeof window !== 'undefined') {
            setGetEmail(window.localStorage.getItem('email'))
        }

        async function handleSubmitGoogle() {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('email', session.user.email)
                reqPass = window.prompt('Enter secret password, keep in mind that it will be use for purchase verification.')
            }
            const notyf = new Notyf({
                duration: 5000,
                position: {
                    x: 'right',
                    y: 'top'
                }
            });

            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({ email: session.user.email, name: session.user.name, password: reqPass })
                })
                if (res.error) {
                    notyf.error('Error: ' + res.error)
                }
                notyf.success('Welcome ' + session.user.email)

            } catch (error) {
                notyf.error('Error: ' + error)
            }
        }
        if (!getEmail) {
            handleSubmitGoogle()
        }

        return (
            <>
                <div className='authContainer'>
                    {" "}
                    <div className='profileImage'>
                        <Image src={session.user.image} alt='user image' className='image' width={2000} height={2000} />
                    </div>
                    <h1 className='text-black '>Signed in as {session.user.email}</h1> <br /> {" "}
                    <button className='signin-btn' onClick={() => signOut("google")}>Sign out</button>{" "}
                </div>
            </>
        )
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });

        try {
            const res = await fetch('/api/auth/authentification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            if (res.status === 200) {
                navigation.push("/");
                notyf.success('Successfully logged in')
            } else {
                notyf.error('User not found')
            }
        } catch (error) {
            console.log(error);
            notyf.error('error')
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
        <>
            {loader && <Load />}
            <div className='authContainer nav-obscure-view'>
                <div className='signCard'  >
                    <form className='sign-form' onSubmit={handleSubmit}>
                        <div className=' mb-3 flex flex-col'>
                            <h1 className='signin-label text-3xl m-auto'>Sign in</h1>
                            <label htmlFor="email" className=' signin-label pb-1'>
                                Email
                            </label>
                            <input type="email" value={email} name='email' placeholder='Enter email...' className='singin-holder outline-0 rounded-none form-control py-2 px-4 border' onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className=' mb-6 flex flex-col'>
                            <label htmlFor="password" className=' signin-label pb-1'>
                                Password
                            </label>
                            <input type="password" value={password} name='password' placeholder='*******' className='singin-holder outline-0 rounded-none form-control py-2 px-4 border' onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button className='signin-btn' type='submit'>
                            Login
                        </button>
                        <p className='text-centr text-[15px] text-[blue] pt-[6px]'><Link href={'/signup'}>Don't have an account? signup</Link></p>
                    </form>
                    <h1 className='signin-opt text-2xl'>or</h1>

                    <button className='signin-btn' onClick={() => { signIn("google"); setLoader(true) }}>Sign in with <FcGoogle size={30} /> </button>
                </div>
            </div>
        </>
    )
}

export default Page
