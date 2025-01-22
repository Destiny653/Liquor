'use client';
import React, { useContext, useState } from 'react';
import './check.css';
import { CartContext } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Notyf } from 'notyf';
import { Link } from 'react-feather-icon';
import axios from 'axios';

export default function Checkout({ amount }) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [useremail, setUseremail] = useState('');
    const [loader, setLoader] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const navigation = useRouter();
    const { data: session } = useSession();
    const { cartItems } = useContext(CartContext);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const totalPrice = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email');
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, cartItems })
            });
            const data = await res.json();
            setLoader(false);
            if (res.status === 404) {
                notyf.error(data.message);
                navigation.push('/signup');
            } else if (data.success) {
                notyf.success(data.message);
            } else {
                notyf.error('Error placing order: ' + res.statusText);
            }
        } catch (error) {
            setLoader(false);
            notyf.error(`Error placing order: ${error.message}`);
        }
    };

    const config = {
        headers: {
            "X-CC-Api-Key": process.env.NEXT_PUBLIC_COINBASE_API_KEY,
        },
    }

    const payWithCrypto = async (amount, currency) => {
        setLoader(true);
        const data = {
            local_price: {
                amount,
                currency,
            },
            description: "Payment for a product",
            pricing_type: "fixed_price",
        };
        await axios
            .post("https://api.commerce.coinbase.com/charges", data, config)
            .then((response) => {
                setPaymentUrl(response.data.data.hosted_url);
                console.log('hosted URl', response.data.data.hosted_url);
                setLoader(false);
            }).catch((error) => {
                setLoader(false);
                console.error("error from fronted func:", error);
            })
    }

    console.log("PaymentUrl: ", paymentUrl);
    

    const Load = () => (
        <div className='top-0 z-10 fixed bg-[#c6c5ec65] w-full h-[100%] loader-p'>
            <div className='loader-con'>
                <section className='loader-i'></section>
            </div>
        </div>
    );

    return (
        <div className='box-border flex justify-center gap-2 pt-6 w-full nav-obscure-view section-con'>
            {loader && <Load />}
            <form onSubmit={handleSubmit} className='box-border flex flex-col gap-3 form-section p-5 pt-0 w-2/4'>
                <h1 className='font-medium text-2xl roboto'>Billing details</h1>
                <fieldset className='flex gap-4 input-name'>
                    <label className='flex flex-col gap-1 w-full' htmlFor="firstname">
                        <span>First name*</span>
                        <input className='px-6 py-2 border' type="text" />
                    </label>
                    <label className='flex flex-col gap-1 w-full' htmlFor="lastname">
                        <span>Last name*</span>
                        <input className='px-6 py-2 border' type="text" />
                    </label>
                </fieldset>
                <label className='flex flex-col gap-1' htmlFor="useremail">
                    <span>Email</span>
                    <input className='px-6 py-2 border' type="email" />
                </label>
                <label className='flex flex-col gap-1'>
                    <span>Country/Region*</span>
                    <input className='px-6 py-2 border' type="text" placeholder='USA' />
                </label>
                <label className='flex flex-col gap-1'>
                    <span>Street address*</span>
                    <input className='px-6 py-2 border' type="text" placeholder='House number and street name' />
                </label>
                <label className='flex flex-col gap-1'>
                    <span>Town/City*</span>
                    <input className='px-6 py-2 border' type="text" placeholder='City' />
                </label>
                <label className='flex flex-col gap-1'>
                    <span>State*</span>
                    <input className='px-6 py-2 border' type="text" placeholder='State' />
                </label>
                <label className='flex flex-col gap-1'>
                    <span>Zip/Postal code*</span>
                    <input className='px-6 py-2 border' type="text" placeholder='Zip code' />
                </label>
                <label className='flex flex-col gap-1'>
                    <span>Phone number*</span>
                    <input className='px-6 py-2 border' type="text" placeholder='Phone number' />
                </label>
                <label className='flex gap-4'>
                    <input type="checkbox" />
                    <span>Create an account</span>
                </label>
                <label className='flex gap-4'>
                    <input type="checkbox" />
                    <span className='font-medium text-xl'>Ship to a different address?</span>
                </label>
                <label className='flex flex-col gap-2'>
                    <span>Additional information</span>
                    <textarea className='px-6 border' cols="4" rows="4" placeholder='Notes about your order'></textarea>
                </label>
                <button onClick={() => setLoader(true)} className='bg-[#1d1b8a] my-[4px] py-2 font-medium text-lg text-white roboto' type='submit'>Mobile Payment</button>
            </form>
            <section className='box-border p-3 w-2/4 table-section'>
                <table className='box-border mb-3 p-7 border w-full'>
                    <caption className='mb-3 font-medium text-2xl text-left roboto'>Your order</caption>
                    <thead>
                        <tr>
                            <th className='pb-4 border-b text-left'>Product name</th>
                            <th className='pb-4 border-b text-left'>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.title}</td>
                                <td>{formatter.format(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className='font-medium text'>
                        <tr>
                            <td>Subtotal</td>
                            <td>{formatter.format(totalPrice)}</td>
                        </tr>
                        <tr>
                            <td>Shipping</td>
                            <td>Flat rate</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>$70</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{formatter.format(totalPrice + 70)}</td>
                        </tr>
                    </tfoot>
                </table>
                <div className='flex flex-col gap-[10px] w-full'>
                    {
                        paymentUrl && (
                            <a href={paymentUrl} target='_blank'>
                                <button className='bg-[#1b8a37] my-[4px] py-2 w-full font-medium text-lg text-white outline-0 roboto'>Validate Payment</button>
                            </a>
                        )}
                    {!paymentUrl &&
                        <button onClick={() => payWithCrypto(totalPrice + 70, 'XAF')} className='bg-[#1d1b8a] my-[4px] py-2 font-medium text-lg text-white roboto'>Pay with crypto wallet</button>
                    }
                    <button onClick={() => setLoader(true)} className='bg-[#610f0f] my-[4px] py-2 font-medium text-lg text-white roboto'>Pay with mobile payment</button>
                </div>
                <div className='flex flex-col gap-4 font-medium'>
                    <label className='flex gap-3' htmlFor="radio">
                        <input type="radio" name='radio' />
                        <span>Cash on delivery</span>
                    </label>
                    <label className='flex gap-3' htmlFor="radio">
                        <input type="radio" name='radio' />
                        <span>Paypal</span>
                    </label>
                    <label className='flex gap-3' htmlFor="radio">
                        <input type="radio" name='radio' />
                        <span>Credit card</span>
                    </label>
                </div>
            </section>
        </div>
    )
}
