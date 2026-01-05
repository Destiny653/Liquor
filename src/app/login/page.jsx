'use client'
import React, { useState, useEffect } from 'react'
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

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;

        if (session) {
            // Redirect based on role
            if (session.user?.role === 'manager') {
                navigation.push('/dashboard/posts');
            } else {
                navigation.push('/');
            }
        }
    }, [session, status, navigation]);

    // If session exists, show loader while redirecting
    if (session) {
        return (
            <div className='auth-loader-overlay'>
                <div className='auth-loader'></div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoader(true);

        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });


            if (result?.ok) {
                notyf.success("Successfully logged in");

                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('email', email);
                }

                // Use a slight delay or just push to ensure state settles
                setTimeout(() => {
                    navigation.push("/");
                    setBtnLoader(false);
                }, 100);
            } else {
                setBtnLoader(false);
                notyf.error(result?.error || "Invalid email or password");
            }
        } catch (error) {
            setBtnLoader(false);
            notyf.error("Something went wrong");
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
                        <form className='auth-form' onSubmit={handleSubmit} method="POST">
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
                                Don&apos;t have an account?{' '}
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
