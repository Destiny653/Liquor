'use client';
import React, { useContext, useState, useEffect } from 'react';
import './check.css';
import Link from 'next/link';
import { CartContext } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Notyf } from 'notyf';
import axios from 'axios';
import { makePayment } from '@/utils/helper';
import { FiCreditCard, FiSmartphone, FiLock, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { FaApple } from "react-icons/fa";
import { SiZelle, SiCashapp } from "react-icons/si";
import { BiTransfer } from "react-icons/bi";
import { PiBank } from "react-icons/pi";

export default function Checkout() {
    const [mounted, setMounted] = useState(false);
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
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigation = useRouter();
    const { data: session } = useSession();
    const { cartItems, emptyCart } = useContext(CartContext);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const totalPrice = cartItems?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0;
    const tax = 70;
    const shipping = 0;
    const grandTotal = totalPrice + tax + shipping;

    useEffect(() => {
        setMounted(true);
    }, []);

    const paymentMethods = [
        { id: 'apple_pay', name: 'Apple Pay', desc: 'Secure payment via Apple Pay', icon: FaApple },
        { id: 'zelle', name: 'Zelle', desc: 'Pay instantly with Zelle', icon: SiZelle },
        { id: 'cash_app', name: 'Cash App', desc: 'Send cash via Cash App', icon: SiCashapp },
        { id: 'etransfer', name: 'E-Transfer', desc: 'Direct bank transfer', icon: BiTransfer },
        { id: 'chime', name: 'Chime', desc: 'Mobile banking', icon: PiBank },
    ];

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        const email = localStorage.getItem('email');
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

        if (!firstname || !lastname || !useremail || !streetAddress || !city || !state || !zipCode || !phone) {
            notyf.error('Please fill in all required fields');
            setLoader(false);
            return;
        }

        if (!paymentMethod) {
            notyf.error('Please select a payment method');
            setLoader(false);
            return;
        }

        try {
            const orderData = {
                email,
                cartItems,
                billingDetails: {
                    firstname, lastname, useremail, country,
                    streetAddress, city, state, zipCode, phone, additionalNotes
                },
                paymentMethod
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
                // notyf.success(data.message);
                // Show modal instead
                setShowSuccessModal(true);
                emptyCart();
            } else {
                notyf.error('Error placing order: ' + res.statusText);
            }
        } catch (error) {
            notyf.error(`Error placing order: ${error.message}`);
        } finally {
            setLoader(false);
        }
    };



    if (!mounted) return null;

    return (
        <div className='checkout-page nav-obscure-view'>
            {/* Loader */}
            {loader && (
                <div className='checkout-loader-overlay'>
                    <div className='checkout-loader'></div>
                </div>
            )}

            {/* Header */}
            <div className='checkout-header'>
                <span className='checkout-header-label'>Secure Checkout</span>
                <h1 className='checkout-header-title'>Complete Your Order</h1>

                {/* Steps */}
                <div className='checkout-header-steps'>
                    <div className='checkout-step completed'>
                        <span className='checkout-step-number'><FiCheck /></span>
                        <span>Cart</span>
                    </div>
                    <div className='checkout-step-divider'></div>
                    <div className='checkout-step active'>
                        <span className='checkout-step-number'>2</span>
                        <span>Checkout</span>
                    </div>
                    <div className='checkout-step-divider'></div>
                    <div className='checkout-step'>
                        <span className='checkout-step-number'>3</span>
                        <span>Confirmation</span>
                    </div>
                </div>
            </div>

            <div className='checkout-layout'>
                {/* Billing Details Form */}
                <div className='checkout-billing'>
                    <h2 className='checkout-section-title'>Billing Details</h2>

                    <form className='checkout-form' onSubmit={handleSubmit}>
                        {/* Name Row */}
                        <div className='checkout-form-row'>
                            <div className='checkout-form-group'>
                                <label className='checkout-label'>
                                    First Name <span className='required'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='checkout-input'
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    placeholder='John'
                                    required
                                />
                            </div>
                            <div className='checkout-form-group'>
                                <label className='checkout-label'>
                                    Last Name <span className='required'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='checkout-input'
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    placeholder='Doe'
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className='checkout-form-group'>
                            <label className='checkout-label'>
                                Email Address <span className='required'>*</span>
                            </label>
                            <input
                                type='email'
                                className='checkout-input'
                                value={useremail}
                                onChange={(e) => setUseremail(e.target.value)}
                                placeholder='john@example.com'
                                required
                            />
                        </div>

                        {/* Country */}
                        <div className='checkout-form-group'>
                            <label className='checkout-label'>
                                Country / Region <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                className='checkout-input'
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder='United States'
                                required
                            />
                        </div>

                        {/* Street Address */}
                        <div className='checkout-form-group'>
                            <label className='checkout-label'>
                                Street Address <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                className='checkout-input'
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                placeholder='123 Main Street, Apt 4'
                                required
                            />
                        </div>

                        {/* City & State Row */}
                        <div className='checkout-form-row'>
                            <div className='checkout-form-group'>
                                <label className='checkout-label'>
                                    City <span className='required'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='checkout-input'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder='New York'
                                    required
                                />
                            </div>
                            <div className='checkout-form-group'>
                                <label className='checkout-label'>
                                    State <span className='required'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='checkout-input'
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder='NY'
                                    required
                                />
                            </div>
                        </div>

                        {/* Zip & Phone Row */}
                        <div className='checkout-form-row'>
                            <div className='checkout-form-group'>
                                <label className='checkout-label'>
                                    ZIP Code <span className='required'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='checkout-input'
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    placeholder='10001'
                                    required
                                />
                            </div>
                            <div className='checkout-form-group'>
                                <label className='checkout-label'>
                                    Phone <span className='required'>*</span>
                                </label>
                                <input
                                    type='tel'
                                    className='checkout-input'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder='+1 (555) 123-4567'
                                    required
                                />
                            </div>
                        </div>

                        {/* Checkboxes */}
                        <label className='checkout-checkbox-group'>
                            <input
                                type='checkbox'
                                className='checkout-checkbox'
                                checked={createAccount}
                                onChange={(e) => setCreateAccount(e.target.checked)}
                            />
                            <span className='checkout-checkbox-label'>Create an account for faster checkout</span>
                        </label>

                        <label className='checkout-checkbox-group'>
                            <input
                                type='checkbox'
                                className='checkout-checkbox'
                                checked={differentShipping}
                                onChange={(e) => setDifferentShipping(e.target.checked)}
                            />
                            <span className='checkout-checkbox-label'>Ship to a different address</span>
                        </label>

                        {/* Additional Notes */}
                        <div className='checkout-form-group'>
                            <label className='checkout-label'>Order Notes (Optional)</label>
                            <textarea
                                className='checkout-input checkout-textarea'
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                                placeholder='Any special instructions for delivery...'
                            />
                        </div>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className='checkout-summary'>
                    {/* Order Items */}
                    <div className='checkout-summary-card'>
                        <h3 className='checkout-summary-title'>Order Summary</h3>

                        <div className='checkout-items'>
                            {cartItems?.map((item, index) => (
                                <div key={index} className='checkout-item'>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className='checkout-item-image'
                                    />
                                    <div className='checkout-item-details'>
                                        <h4 className='checkout-item-title'>
                                            {item.title?.slice(0, 25)}{item.title?.length > 25 ? '...' : ''}
                                        </h4>
                                        <p className='checkout-item-qty'>Qty: {item.quantity}</p>
                                    </div>
                                    <span className='checkout-item-price'>
                                        {formatter.format((item.price || 0) * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className='checkout-totals'>
                            <div className='checkout-total-row'>
                                <span className='checkout-total-label'>Subtotal</span>
                                <span className='checkout-total-value'>{formatter.format(totalPrice)}</span>
                            </div>
                            <div className='checkout-total-row'>
                                <span className='checkout-total-label'>Shipping</span>
                                <span className='checkout-total-value'>
                                    {shipping === 0 ? 'Free' : formatter.format(shipping)}
                                </span>
                            </div>
                            <div className='checkout-total-row'>
                                <span className='checkout-total-label'>Tax</span>
                                <span className='checkout-total-value'>{formatter.format(tax)}</span>
                            </div>
                            <div className='checkout-total-row grand-total'>
                                <span className='checkout-total-label'>Total</span>
                                <span className='checkout-total-value'>{formatter.format(grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className='checkout-payment-card'>
                        <h3 className='checkout-payment-title'>Payment Method</h3>

                        <div className='checkout-payment-methods'>
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <label
                                        key={method.id}
                                        className={`checkout-payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                                        onClick={() => handlePaymentMethodChange(method.id)}
                                    >
                                        <input
                                            type='radio'
                                            name='paymentMethod'
                                            className='checkout-payment-radio'
                                            checked={paymentMethod === method.id}
                                            onChange={() => handlePaymentMethodChange(method.id)}
                                        />
                                        <div className='checkout-payment-icon'>
                                            <Icon />
                                        </div>
                                        <div className='checkout-payment-info'>
                                            <h4>{method.name}</h4>
                                            <p>{method.desc}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='checkout-submit-btn'
                            onClick={handleSubmit}
                            disabled={!paymentMethod || loader}
                        >
                            {loader ? 'Processing...' : 'Place Order'}
                            <FiArrowRight />
                        </button>



                        {/* Security */}
                        <div className='checkout-security'>
                            <FiLock size={14} />
                            <span>Secure checkout powered by Stripe</span>
                        </div>
                    </div>
                </div>
                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn text-center">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiCheck className="text-green-600 text-3xl" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Received!</h2>
                            <p className="text-gray-600 mb-6">
                                Thank you for your order. We have received your request and payment preference.
                                <br /><br />
                                <strong>We will contact you shortly</strong> via the provided phone number or email to finalize the payment and shipping.
                            </p>

                            <Link
                                href="/"
                                className="inline-block w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}