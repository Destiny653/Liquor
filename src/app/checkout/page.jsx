'use client';
import React, { useContext, useEffect, useState } from 'react';
import './check.css';
import { CartContext } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Notyf } from 'notyf';
import { createCoinbasePaymentCharge } from '../api/payment/route';
import { Link } from 'react-feather-icon';


export default function Checkout({ amount }) {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [useremail, setUseremail] = useState('')
    const [userRes, setUserRes] = useState('')
    const navigation = useRouter();
    const [loader, setLoader] = useState(false)
    const [paymentUrl, setPaymentUrl] = useState(null)
    const [getTotal, setGetTotal] = useState(0)

    // const {signIn} = useContext(SearchContext)
    // console.log(signIn);
    const { data: session } = useSession()
    console.log(session);

    const { cartItems } = useContext(CartContext)
    console.log(cartItems);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    let totalPrice = 0;
    let totalPriceFix;
    // get email from local storage


    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email')
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });

        try {

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, cartItems })
            })
            const data = await res.json();
            console.log(data)
            // in success:false
            if (res.status == 404) {
                setLoader(false)
                notyf.error(data.message)
                navigation.push('/signup')
            } else if (data.success) {
                setLoader(false)
                notyf.success(data.message)
            } else {
                setLoader(false)
                notyf.error('Error placing order: ' + res.statusText)
            }
        } catch (error) {
            setLoader(false)
            notyf.error(`Error placing order: ${error.message}`);
            console.log(error);
        }
    }

    const handlePayment = async (ammount, currency) => {
        setLoader(true)
        try {
            const charge = await createCoinbasePaymentCharge(ammount, currency);
            setPaymentUrl(charge.data.hosted_url)
            setLoader(false)
        } catch (error) {
            setLoader(false)
            console.log('Handlepayment Error: ', error.message);

        }
    }

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
        <>

            {/* checkout your card items */}

            <div className='box-border flex justify-center gap-2 pt-6 w-full nav-obscure-view section-con'>
                {
                    loader ? <Load /> : console.log('not loading')

                }
                <form onSubmit={handleSubmit} className='box-border flex flex-col gap-3 form-section p-5 pt-0 w-2/4'>
                    <h1 className='font-medium text-2xl roboto'>Billing details</h1>
                    <fieldset className='flex gap-4 input-name'>
                        <label className='flex flex-col gap-1 w-full' htmlFor="name">
                            <span>First name*</span>
                            <input className='px-6 py-2 border' type="text" name='text' value={firstname} onChange={e => setFirstname(e.target.value)} />
                        </label>
                        <label className='flex flex-col gap-1 w-full' htmlFor="name">
                            <span>Last name*</span>
                            <input className='px-6 py-2 border' type="text" name='text' value={lastname} onChange={e => setLastname(e.target.value)} />
                        </label>
                    </fieldset>
                    <label className='flex flex-col gap-1' htmlFor="email">
                        <span>Email</span>
                        <input className='px-6 py-2 border' type="email" name='text' value={useremail} onChange={e => setUseremail(e.target.value)} />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Country/Region*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='USA' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Street address*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='House number and street name' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Town/City*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='City' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>State*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='State' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Zip/Postal code*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='Zip code' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Phone number*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='Phone number' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Email address*</span>
                        <input className='px-6 py-2 border' type="text" name='text' placeholder='Email address' />
                    </label>
                    <label className='flex gap-4' htmlFor="checkbox">
                        <input type="checkbox" name='checkbox' />
                        <span>Create an account</span>
                    </label>
                    <label className='flex gap-4' htmlFor="checkbox">
                        <input type="checkbox" name='checkbox' />
                        <span className='font-medium text-xl'>Ship to a different address?</span>
                    </label>
                    <label className='flex flex-col gap-2' htmlFor="textarea">
                        <span>Additional information</span>
                        <textarea className='px-6 border' name="textarea" id="textarea" cols="4" rows="4" placeholder='Notes about your order, e.g. special notes for delivery'></textarea>
                    </label>
                    <button onClick={() => { setLoader(true) }} className='bg-[#1d1b8a] my-[4px] py-2 font-medium text-lg text-white roboto' type='submit' >Mobile Payment</button>
                </form>
                <section className='box-border p-3 w-2/4 table-section'>
                    <table className='box-border mb-3 p-7 border w-full'>
                        <caption className='mb-3 font-medium text-2xl text-left roboto'>Your order</caption>
                        <thead>
                            <tr>
                                <th className='pb-4 border-b text-left' scope='col'>Product name</th>
                                <th className='pb-4 border-b text-left' scope='col'>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartItems?.map(item => {

                                    let orderPrice = item.price * item.quantity
                                    totalPrice += item.price * item.quantity; // calculate total price 
                                    setGetTotal(totalPrice)

                                    return (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{formatter.format(orderPrice)}</td>
                                        </tr>
                                    )
                                })
                            }
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
                            paymentUrl ?
                                <Link href={paymentUrl} target='_blank'>
                                    <button className='bg-[#1b8a37] my-[4px] py-2 font-medium text-lg text-white roboto' >{loader ? 'processing' : 'Validate Payment'}</button>
                                </Link>
                                : <button onClick={() => { setLoader(true); handlePayment(formatter.format(getTotal + 70), 'XAF') }} className='bg-[#1d1b8a] my-[4px] py-2 font-medium text-lg text-white roboto' type='submit' >Pay with crypto wallet</button>
                        }
                        <button onClick={() => { setLoader(true) }} className='bg-[#610f0f] my-[4px] py-2 font-medium text-lg text-white roboto' type='submit' >Pay with mobile payment</button>
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
        </>
    )
}
