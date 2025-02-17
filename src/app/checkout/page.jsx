'use client';
import React, { useContext, useState } from 'react';
import './check.css';
import { CartContext } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Notyf } from 'notyf';
import { Link } from 'react-feather-icon';
import axios from 'axios';
import { makePayment } from '@/utils/helper';

export default function Checkout({ amount }) {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [useremail, setUseremail] = useState('');
    const [country, setCountry] = useState('USA');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [createAccount, setCreateAccount] = useState(false);
    const [differentShipping, setDifferentShipping] = useState(false);
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loader, setLoader] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [payUrl, setPayUrl] = useState(null);

    const navigation = useRouter();
    const { data: session } = useSession();
    const { cartItems } = useContext(CartContext);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const totalPrice = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        setPaymentUrl(null);
        setPayUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const email = localStorage.getItem('email');
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

        // Form validation
        if (!firstname || !lastname || !useremail || !streetAddress || !city || !state || !zipCode || !phone) {
            notyf.error('Please fill in all required fields');
            setLoader(false);
            return;
        }

        try {
            const orderData = {
                email,
                cartItems,
                billingDetails: {
                    firstname,
                    lastname,
                    useremail,
                    country,
                    streetAddress,
                    city,
                    state,
                    zipCode,
                    phone,
                    additionalNotes
                }
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.status === 404) {
                notyf.error(data.message);
                navigation.push('/signup');
            } else if (data.success) {
                notyf.success(data.message);
                handlePaymentProcess();
            } else {
                notyf.error('Error placing order: ' + res.statusText);
            }
        } catch (error) {
            notyf.error(`Error placing order: ${error.message}`);
        } finally {
            setLoader(false);
        }
    };

    const handlePaymentProcess = async () => {
        switch (paymentMethod) {
            case 'crypto':
                await handleCryptoPayment();
                break;
            case 'mobile':
                await handleMobilePayment();
                break;
            case 'paypal':
                await handlePaypalPayment();
                break;
            case 'credit':
                await handleCreditCardPayment();
                break;
            default:
                const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
                notyf.error('Please select a payment method');
        }
    };

    const handleCryptoPayment = async () => {
        const config = {
            headers: {
                "X-CC-Api-Key": process.env.NEXT_PUBLIC_COINBASE_API_KEY,
            },
        };

        try {
            const response = await axios.post(
                "https://api.commerce.coinbase.com/charges",
                {
                    local_price: {
                        amount: totalPrice + 70,
                        currency: 'XAF',
                    },
                    description: "Payment for a product",
                    pricing_type: "fixed_price",
                },
                config
            );
            setPaymentUrl(response.data.data.hosted_url);
        } catch (error) {
            const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
            notyf.error('Error processing crypto payment');
        }
    };

    const handleMobilePayment = async () => {
        try {
            const paymentData = await makePayment(cartItems, totalPrice + 70);
            setPayUrl(paymentData);
        } catch (error) {
            const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
            notyf.error('Error processing mobile payment');
        }
    };

    const handlePaypalPayment = async () => {
        // Implement PayPal payment logic
    };

    const handleCreditCardPayment = async () => {
        // Implement credit card payment logic
    };

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

            {/* Billing Details Form */}
            <form onSubmit={handleSubmit} className='box-border flex flex-col gap-3 form-section p-5 pt-0 w-2/4'>
                <h1 className='font-medium text-2xl roboto'>Billing details</h1>

                <fieldset className='flex gap-4 input-name'>
                    <label className='flex flex-col gap-1 w-full'>
                        <span>First name*</span>
                        <input
                            className='px-6 py-2 border'
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </label>
                    <label className='flex flex-col gap-1 w-full'>
                        <span>Last name*</span>
                        <input
                            className='px-6 py-2 border'
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </label>
                </fieldset>

                <label className='flex flex-col gap-1'>
                    <span>Email*</span>
                    <input
                        className='px-6 py-2 border'
                        type="email"
                        value={useremail}
                        onChange={(e) => setUseremail(e.target.value)}
                        required
                    />
                </label>

                <label className='flex flex-col gap-1'>
                    <span>Country/Region*</span>
                    <input
                        className='px-6 py-2 border'
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='USA'
                        required
                    />
                </label>

                <label className='flex flex-col gap-1'>
                    <span>Street address*</span>
                    <input
                        className='px-6 py-2 border'
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder='House number and street name'
                        required
                    />
                </label>

                <label className='flex flex-col gap-1'>
                    <span>Town/City*</span>
                    <input
                        className='px-6 py-2 border'
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='City'
                        required
                    />
                </label>

                <label className='flex flex-col gap-1'>
                    <span>State*</span>
                    <input
                        className='px-6 py-2 border'
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder='State'
                        required
                    />
                </label>

                <label className='flex flex-col gap-1'>
                    <span>Zip/Postal code*</span>
                    <input
                        className='px-6 py-2 border'
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder='Zip code'
                        required
                    />
                </label>

                <label className='flex flex-col gap-1'>
                    <span>Phone number*</span>
                    <input
                        className='px-6 py-2 border'
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder='Phone number'
                        required
                    />
                </label>

                <label className='flex gap-4'>
                    <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                    />
                    <span>Create an account</span>
                </label>

                <label className='flex gap-4'>
                    <input
                        type="checkbox"
                        checked={differentShipping}
                        onChange={(e) => setDifferentShipping(e.target.checked)}
                    />
                    <span className='font-medium text-xl'>Ship to a different address?</span>
                </label>

                <label className='flex flex-col gap-2'>
                    <span>Additional information</span>
                    <textarea
                        className='px-6 border'
                        cols="4"
                        rows="4"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder='Notes about your order'
                    />
                </label>
            </form>

            {/* Order Summary and Payment Section */}
            <section className='table-section box-border p-3 w-2/4'>
                <div className="box-border mb-3 p-7 border w-full">
                    <h2 className='mb-3 font-medium text-2xl text-left roboto'>Your order</h2>

                    {/* Product List */}
                    <div className="mb-6">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex items-center py-4 border-b">
                                {/* Product Image */}
                                <div className="flex-shrink-0 mr-4 rounded-md w-20 h-20 overflow-hidden text-[15px]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full text-[15px]"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow">
                                    <h3 className="font-medium text-lg">{item.title}</h3>
                                    <div className="text-gray-600 text-sm">
                                        Quantity: {item.quantity}
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex-shrink-0 ml-4 font-medium">
                                    {formatter.format(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="pt-4 border-t">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatter.format(totalPrice)}</span>
                        </div>

                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">Flat rate</span>
                        </div>

                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">$70</span>
                        </div>

                        <div className="flex justify-between mt-2 py-3 border-t">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-lg">{formatter.format(totalPrice + 70)}</span>
                        </div>
                    </div>
                </div>
                {/* Payment Methods */}
                <div className='flex flex-col gap-4 mb-4 font-medium'>
                    <h2 className='mb-2 text-xl'>Select Payment Method</h2>
                    <label className='flex gap-3 cursor-pointer'>
                        <input
                            type="radio"
                            name='paymentMethod'
                            value="crypto"
                            checked={paymentMethod === 'crypto'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        />
                        <span>Crypto Wallet</span>
                    </label>
                    <label className='flex gap-3 cursor-pointer'>
                        <input
                            type="radio"
                            name='paymentMethod'
                            value="mobile"
                            checked={paymentMethod === 'mobile'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        />
                        <span>Mobile Payment</span>
                    </label>
                    <label className='flex gap-3 cursor-pointer'>
                        <input
                            type="radio"
                            name='paymentMethod'
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        />
                        <span>PayPal</span>
                    </label>
                    <label className='flex gap-3 cursor-pointer'>
                        <input
                            type="radio"
                            name='paymentMethod'
                            value="credit"
                            checked={paymentMethod === 'credit'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                        />
                        <span>Credit Card</span>
                    </label>
                </div>

                {/* Payment Button */}
                {paymentMethod && (
                    <button
                        onClick={handleSubmit}
                        className='bg-[#1d1b8a] my-[4px] py-2 w-full font-medium text-white text-lg roboto'
                    >
                        Place Order and Pay
                    </button>
                )}

                {/* Payment Validation Links */}
                {paymentUrl && (
                    <a
                        href={paymentUrl}
                        className='block bg-[#1b8a37] my-[4px] py-2 outline-0 w-full font-medium text-white text-lg text-center roboto'
                        target='_blank'
                        rel="noopener noreferrer"
                    >
                        Validate Crypto Payment
                    </a>
                )}

                {payUrl && (
                    <a
                        href={payUrl}
                        className='block bg-[#1b8a37] my-[4px] py-2 outline-0 w-full font-medium text-white text-lg text-center roboto'
                        target='_blank'
                        rel="noopener noreferrer"
                    >
                        Validate Mobile Payment
                    </a>
                )}
            </section>
        </div>
    );
}