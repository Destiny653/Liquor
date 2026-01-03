'use client'
import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
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
    const [btnLoader, setBtnLoader] = useState(false);

    let localStorageEmail = null

    const { data: session } = useSession()
    console.log(session)

    if (session) {
        let reqPass = null;
        if (typeof window !== 'undefined') {
            localStorageEmail = window.localStorage.getItem('email')
        }

        async function handleSubmitGoogle() {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('email', session.user.email)
                reqPass = window.prompt('Enter secret password, keep in mind that it will be used for purchase verification.')
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
                const data = await res.json()
                console.log(data);

                if (data.error) {
                    setBtnLoader(false)
                    notyf.error(data.message)
                }
            } catch (error) {
                setBtnLoader(false)
                notyf.error('Error: ' + error)
            }
        }
        console.log(localStorageEmail);

        if (!localStorageEmail) {
            handleSubmitGoogle()
        }

        // Logged in state
        return (
            <div className='auth-page'>
                <div className='auth-container'>
                    <div className='auth-card'>
                        <div className='profile-card'>
                            <div className='profile-image-wrapper'>
                                <img
                                    src={session ? session.user?.image : '/images/default-avatar.png'}
                                    alt='Profile'
                                    className='profile-image'
                                />
                            </div>
                            <h2 className='profile-name'>{session.user?.name || 'Welcome'}</h2>
                            <p className='profile-email'>Signed in as {session.user.email}</p>
                            <button
                                className='auth-signout-btn'
                                onClick={() => {
                                    alert('You are currently signed out.');
                                    signOut("google");
                                    typeof window !== 'undefined' && window.localStorage.removeItem('email');
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
            if (res.status === 201) {
                setBtnLoader(false)
                notyf.success('Successfully logged in')
                navigation.push("/");
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('email', email)
                }
            } else {
                setBtnLoader(false)
                notyf.error('User not found')
            }
        } catch (error) {
            console.log(error);
            notyf.error('error')
        }
    };

    const Loader = () => (
        <div className='auth-loader-overlay'>
            <div className='auth-loader'></div>
        </div>
    );

    const BtnLoader = () => (
        <div className='btn-loader'></div>
    );

    return (
        <>
            {loader && <Loader />}
            <div className='auth-page'>
                <div className='auth-container'>
                    <div className='auth-card'>
                        {/* Header */}
                        <div className='auth-header'>
                            <div className='auth-logo'>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 2h8l4 10H4L8 2z"></path>
                                    <path d="M12 12v6"></path>
                                    <path d="M8 22h8"></path>
                                    <path d="M12 18c2 0 4-1 4-3"></path>
                                </svg>
                            </div>
                            <h1 className='auth-title'>Welcome Back</h1>
                            <p className='auth-subtitle'>Sign in to continue to LiquorLuxx</p>
                        </div>

                        {/* Form */}
                        <form className='auth-form' onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label htmlFor="email" className='form-label'>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    name='email'
                                    placeholder='Enter your email'
                                    className='form-input'
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="password" className='form-label'>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    name='password'
                                    placeholder='Enter your password'
                                    className='form-input'
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                onClick={() => setBtnLoader(true)}
                                disabled={btnLoader}
                                className='auth-submit-btn'
                                type='submit'
                            >
                                {btnLoader ? <BtnLoader /> : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className='auth-divider'>
                            <span className='auth-divider-line'></span>
                            <span className='auth-divider-text'>or</span>
                            <span className='auth-divider-line'></span>
                        </div>

                        {/* Google Sign In */}
                        <button
                            className='auth-google-btn'
                            onClick={() => { signIn("google"); setLoader(true) }}
                        >
                            <FcGoogle size={24} />
                            Continue with Google
                        </button>

                        {/* Footer */}
                        <div className='auth-footer'>
                            <p className='auth-footer-text'>
                                Don't have an account?{' '}
                                <Link href='/signup' className='auth-footer-link'>
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page
