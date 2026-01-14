'use client';
import React, { useContext, useEffect, useState } from 'react';
import './CartSlider.css';
import Link from 'next/link';
import { FiShoppingCart, FiX, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';
import { CartContext } from '../../../../context/CartContext';

export default function CartSlider() {
    const { cartItems, handleAddToCart } = useContext(CartContext);
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [mounted, setMounted] = useState(false);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    // Set mounted state to true after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch product data
    useEffect(() => {
        if (!mounted) return;

        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=1000');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products || data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [mounted]);


    // Calculate cart details - only when mounted
    const cartItemsWithDetails = mounted ? (cartItems?.map((item) => {
        const product = products?.find((p) => p._id === item.product_id);
        return { ...item, product };
    }).filter(item => item.product) || []) : [];

    const totalItems = mounted ? (cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0) : 0;
    const subtotal = cartItemsWithDetails.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
    const tax = 70;
    const total = subtotal + tax;

    // Handle body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Return null during SSR to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <>
            {/* Floating Cart Button */}
            <button
                className="cart-float-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Open cart"
            >
                <div className="cart-float-icon">
                    <FiShoppingCart />
                    {totalItems > 0 && (
                        <span className="cart-float-badge">{totalItems}</span>
                    )}
                </div>
                <span className="cart-float-text">Cart</span>
            </button>

            {/* Overlay */}
            <div
                className={`cart-slider-overlay ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Slider Panel */}
            <div className={`cart-slider ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="cart-slider-header">
                    <div className="cart-slider-title">
                        <h2>Shopping Cart</h2>
                        <span className="cart-slider-count">{totalItems}</span>
                    </div>
                    <button
                        className="cart-slider-close"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiX />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="cart-slider-items">
                    {cartItemsWithDetails.length > 0 ? (
                        cartItemsWithDetails.map((item, index) => (
                            <div
                                key={index}
                                className="cart-slider-item"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <img
                                    src={item.product?.img}
                                    alt={item.product?.title}
                                    className="cart-slider-item-image"
                                />
                                <div className="cart-slider-item-details">
                                    <h4 className="cart-slider-item-title">
                                        {item.product?.title}
                                    </h4>
                                    <p className="cart-slider-item-price">
                                        {formatter.format(item.product?.price)}
                                    </p>
                                    <div className="cart-slider-item-controls">
                                        <button
                                            className="cart-slider-qty-btn"
                                            onClick={() => handleAddToCart(item.product, item.quantity)}
                                        >
                                            −
                                        </button>
                                        <span className="cart-slider-qty">{item.quantity}</span>
                                        <button
                                            className="cart-slider-qty-btn"
                                            onClick={() => handleAddToCart(item.product)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-slider-item-actions">
                                    <span className="cart-slider-item-subtotal">
                                        {formatter.format(item.product?.price * item.quantity)}
                                    </span>
                                    <button
                                        className="cart-slider-item-remove"
                                        onClick={() => handleAddToCart(item.product, item.quantity, index)}
                                    >
                                        <FaRegTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="cart-slider-empty">
                            <div className="cart-slider-empty-icon">
                                <FiShoppingBag />
                            </div>
                            <h3>Your cart is empty</h3>
                            <p>Add some premium spirits to get started</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItemsWithDetails.length > 0 && (
                    <div className="cart-slider-footer">
                        <div className="cart-slider-summary">
                            <div className="cart-slider-row">
                                <span className="cart-slider-label">Subtotal</span>
                                <span className="cart-slider-value">{formatter.format(subtotal)}</span>
                            </div>
                            <div className="cart-slider-row">
                                <span className="cart-slider-label">Tax</span>
                                <span className="cart-slider-value">{formatter.format(tax)}</span>
                            </div>
                            <div className="cart-slider-row cart-slider-total">
                                <span className="cart-slider-label">Total</span>
                                <span className="cart-slider-value">{formatter.format(total)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="cart-slider-checkout"
                            onClick={() => setIsOpen(false)}
                        >
                            Checkout
                            <FiArrowRight />
                        </Link>

                        <Link
                            href="/cart"
                            className="cart-slider-view-cart"
                            onClick={() => setIsOpen(false)}
                        >
                            View Full Cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
