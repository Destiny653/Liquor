'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useContext } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
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
    const [phone, setPhone] = useState('')
    const [loader, setLoader] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)

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
            // validate password
            if (password.length < 5) {
                setLoader(false)
                notyf.error('Password must be at least 5 characters long');
                return;
            }

            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    body: JSON.stringify({ name: username, email: email.toLowerCase().trim(), password, phoneNumber: phone }),
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
                setLoader(false)
                notyf.success('Registration successful!');
                navigation.push('/login');
            } catch (error) {
                setLoader(false)
                notyf.error('Registration failed!');
            }
        }
    };

    const Loader = () => (
        <div className='signup-loader-overlay'>
            <div className='signup-loader'></div>
        </div>
    );

    const BtnLoader = () => (
        <div className='signup-btn-loader'></div>
    );

    return (
        <>
            {loader && <Loader />}
            <div className='signup-page'>
                <div className='signup-container'>
                    <div className='signup-card'>
                        {/* Image Section */}
                        <div className='signup-image-section'>
                            <img
                                className='signup-image'
                                src='/images/royal.jpg'
                                alt='Premium liquor collection'
                            />
                            <div className='signup-image-overlay'></div>
                            <div className='signup-image-content'>
                                <div className='signup-image-logo'>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 2h8l4 10H4L8 2z"></path>
                                        <path d="M12 12v6"></path>
                                        <path d="M8 22h8"></path>
                                        <path d="M12 18c2 0 4-1 4-3"></path>
                                    </svg>
                                </div>
                                <h2 className='signup-image-title'>LiquorLuxx</h2>
                                <p className='signup-image-subtitle'>
                                    Join our exclusive collection of premium spirits and fine wines
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className='signup-form-section'>
                            <div className='signup-header'>
                                <h1 className='signup-title'>Create Account</h1>
                                <p className='signup-subtitle'>Start your journey with premium spirits</p>
                            </div>

                            <form className='signup-form' onSubmit={handleSubmit}>
                                <div className='form-group'>
                                    <label htmlFor="username" className='form-label'>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        name='username'
                                        placeholder='Enter your name'
                                        className='form-input'
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

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
                                    <label htmlFor="phone" className='form-label'>
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        name='phone'
                                        placeholder='Enter your phone number'
                                        className='form-input'
                                        onChange={e => setPhone(e.target.value)}
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
                                        placeholder='Create a strong password'
                                        className='form-input'
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type='submit'
                                    className='signup-submit-btn'
                                    disabled={loader}
                                >
                                    {loader ? <BtnLoader /> : 'Create Account'}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className='signup-divider'>
                                <span className='signup-divider-line'></span>
                                <span className='signup-divider-text'>or</span>
                                <span className='signup-divider-line'></span>
                            </div>

                            {/* Google Sign In */}
                            <button
                                className='signup-google-btn'
                                onClick={() => { signIn("google"); setLoader(true) }}
                            >
                                <FcGoogle size={24} />
                                Continue with Google
                            </button>

                            <div className='signup-footer'>
                                <p className='signup-footer-text'>Already have an account?</p>
                                <Link href='/login' className='signup-login-btn'>
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
