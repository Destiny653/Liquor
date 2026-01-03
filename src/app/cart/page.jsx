'use client';
import React, { useContext, useEffect, useState } from 'react';
import './cart.css';
import Link from 'next/link';
import { FaRegTrashAlt, FaShoppingBag, FaLock, FaArrowRight, FaArrowLeft, FaTimes } from "react-icons/fa";
import { CartContext } from '../../../context/CartContext';

export default function Page() {

    const { cartItems, handleAddToCart, emptyCart } = useContext(CartContext);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const [returns, setReturns] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [summaryOpen, setSummaryOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const apis = [
                '/api/posts',
                '/api/baltons',
                '/api/wellers',
                '/api/buffalos',
                '/api/pappies',
                '/api/penelopes',
                '/api/yamazakis',
            ];

            const fetchPromises = apis.map(api => fetch(api).then(res => res.json()));
            const results = await Promise.all(fetchPromises);
            setReturns(results.flat());
        };
        getData();
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Calculate total price
    let totalPrice = 0;
    const cartItemsWithDetails = cartItems?.map((item) => {
        const position = returns?.findIndex((value) => value._id === item.product_id);
        const itemInCart = returns && returns[position];
        const qtyInCart = item.quantity;
        const price = itemInCart?.price || 0;
        totalPrice += price * qtyInCart;
        return { ...item, itemInCart, qtyInCart, price };
    }) || [];

    const tax = 70;
    const shipping = 0;
    const grandTotal = totalPrice + tax + shipping;

    // Handle body scroll when summary is open
    useEffect(() => {
        if (summaryOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [summaryOpen]);

    if (!isClient) return null;

    return (
        <div className='cart-page nav-obscure-view'>
            {/* Cart Header */}
            <div className='cart-header'>
                <span className='cart-header-label'>Shopping Cart</span>
                <h1 className='cart-header-title'>Your Cart</h1>
                <p className='cart-header-count'>
                    {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            <div className='cart-layout'>
                {/* Cart Items Section */}
                <div className='cart-items-section'>
                    {cartItems && cartItems.length > 0 ? (
                        <>
                            <table className='cart-table'>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItemsWithDetails.map((item, index) => {
                                        const { itemInCart, qtyInCart, price } = item;
                                        if (!itemInCart) return null;

                                        return (
                                            <tr key={index}>
                                                <td className='cart-product-cell'>
                                                    <img
                                                        className='cart-product-image'
                                                        src={itemInCart?.img}
                                                        alt={itemInCart?.title}
                                                    />
                                                    <div className='cart-product-info'>
                                                        <h4>{itemInCart?.title}</h4>
                                                        <p>Premium Whiskey</p>
                                                    </div>
                                                </td>
                                                <td className='cart-price-cell'>
                                                    <span className='cart-price'>{formatter.format(price)}</span>
                                                </td>
                                                <td className='cart-qty-cell'>
                                                    <div className='cart-qty-controls'>
                                                        <button
                                                            className='cart-qty-btn'
                                                            onClick={() => handleAddToCart(itemInCart, qtyInCart)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className='cart-qty-value'>{qtyInCart}</span>
                                                        <button
                                                            className='cart-qty-btn'
                                                            onClick={() => handleAddToCart(itemInCart)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className='cart-subtotal-cell'>
                                                    <span className='cart-subtotal'>
                                                        {formatter.format(price * qtyInCart)}
                                                    </span>
                                                </td>
                                                <td className='cart-remove-cell'>
                                                    <button
                                                        className='cart-remove-btn'
                                                        onClick={() => handleAddToCart(itemInCart, qtyInCart, index)}
                                                    >
                                                        <FaRegTrashAlt size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className='cart-actions'>
                                <button
                                    className='cart-reset-btn'
                                    onClick={() => emptyCart()}
                                >
                                    Clear Cart
                                </button>
                                <Link href='/shop' className='cart-continue-btn'>
                                    <FaArrowLeft size={14} />
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className='cart-empty'>
                            <div className='cart-empty-icon'>
                                <FaShoppingBag />
                            </div>
                            <h3>Your Cart is Empty</h3>
                            <p>Looks like you haven't added any items yet</p>
                            <Link href='/shop' className='cart-empty-btn'>
                                Explore Collection
                                <FaArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Desktop Cart Summary */}
                <div className='cart-summary'>
                    <div className='cart-summary-header'>
                        <h3 className='cart-summary-title'>Order Summary</h3>
                        <div className='cart-summary-icon'>
                            <FaShoppingBag size={18} />
                        </div>
                    </div>

                    <div className='cart-summary-rows'>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Subtotal</span>
                            <span className='cart-summary-value'>{formatter.format(totalPrice)}</span>
                        </div>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Shipping</span>
                            <span className='cart-summary-value'>
                                {shipping === 0 ? 'Free' : formatter.format(shipping)}
                            </span>
                        </div>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Tax</span>
                            <span className='cart-summary-value'>{formatter.format(tax)}</span>
                        </div>
                    </div>

                    <div className='cart-summary-total'>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Total</span>
                            <span className='cart-summary-value'>{formatter.format(grandTotal)}</span>
                        </div>
                    </div>

                    <Link href='/checkout' className='cart-checkout-btn'>
                        Proceed to Checkout
                        <FaArrowRight size={14} />
                    </Link>

                    {/* Promo Code */}
                    <div className='cart-promo'>
                        <label className='cart-promo-label'>Have a promo code?</label>
                        <div className='cart-promo-input'>
                            <input type='text' placeholder='Enter code' />
                            <button className='cart-promo-btn'>Apply</button>
                        </div>
                    </div>

                    {/* Security */}
                    <div className='cart-security'>
                        <FaLock size={12} />
                        <span>Secure checkout powered by Stripe</span>
                    </div>
                </div>
            </div>

            {/* Mobile Summary Toggle Button */}
            <div className='cart-summary-toggle'>
                <button
                    className='cart-summary-toggle-btn'
                    onClick={() => setSummaryOpen(true)}
                >
                    <span>View Order Summary</span>
                    <span className='cart-summary-toggle-total'>{formatter.format(grandTotal)}</span>
                </button>
            </div>

            {/* Mobile Summary Overlay */}
            <div
                className={`cart-summary-overlay ${summaryOpen ? 'open' : ''}`}
                onClick={() => setSummaryOpen(false)}
            />

            {/* Mobile Summary Slide-in Sheet */}
            <div className={`cart-summary-sheet ${summaryOpen ? 'open' : ''}`}>
                <div className='cart-sheet-handle' onClick={() => setSummaryOpen(false)}>
                    <span></span>
                </div>
                <div className='cart-sheet-content'>
                    <div className='cart-sheet-header'>
                        <h3 className='cart-sheet-title'>Order Summary</h3>
                        <button
                            className='cart-sheet-close'
                            onClick={() => setSummaryOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Items Preview */}
                    <div className='cart-sheet-items'>
                        {cartItemsWithDetails.map((item, index) => {
                            const { itemInCart, qtyInCart, price } = item;
                            if (!itemInCart) return null;
                            return (
                                <div key={index} className='cart-sheet-item'>
                                    <img src={itemInCart?.img} alt={itemInCart?.title} />
                                    <div className='cart-sheet-item-info'>
                                        <h5>{itemInCart?.title?.slice(0, 20)}...</h5>
                                        <p>Qty: {qtyInCart}</p>
                                    </div>
                                    <span className='cart-sheet-item-price'>
                                        {formatter.format(price * qtyInCart)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Rows */}
                    <div className='cart-summary-rows'>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Subtotal</span>
                            <span className='cart-summary-value'>{formatter.format(totalPrice)}</span>
                        </div>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Shipping</span>
                            <span className='cart-summary-value'>
                                {shipping === 0 ? 'Free' : formatter.format(shipping)}
                            </span>
                        </div>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Tax</span>
                            <span className='cart-summary-value'>{formatter.format(tax)}</span>
                        </div>
                    </div>

                    <div className='cart-summary-total'>
                        <div className='cart-summary-row'>
                            <span className='cart-summary-label'>Total</span>
                            <span className='cart-summary-value'>{formatter.format(grandTotal)}</span>
                        </div>
                    </div>

                    <Link
                        href='/checkout'
                        className='cart-checkout-btn'
                        onClick={() => setSummaryOpen(false)}
                    >
                        Proceed to Checkout
                        <FaArrowRight size={14} />
                    </Link>

                    {/* Security */}
                    <div className='cart-security'>
                        <FaLock size={12} />
                        <span>Secure checkout powered by Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
