'use client';
import React, { useContext, useEffect, useState } from 'react';
import "./hero.css";
import { FaStar } from 'react-icons/fa';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import AOS from "aos";
import "aos/dist/aos.css";
import { SearchContext } from '../../../../context/SearchContext';
import { useRouter } from 'next/navigation';
import { CartContext } from '../../../../context/CartContext';
import SkeletonR, { SkeletonArr } from '../Skeleton/Skeleton';
import { Notyf } from 'notyf';
import Qty from '../Quantity/quantity';

export default function Hero() {
    const [data, setData] = useState(null);
    const { handlePro } = useContext(SearchContext);
    const { handleAddToCart } = useContext(CartContext);
    const navigation = useRouter();
    const [loader, setLoader] = useState(true);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });

        const notyf = new Notyf({
            duration: 4000,
            position: { x: 'right', y: 'top' }
        });

        const getData = async () => {
            setLoader(true);
            try {
                const res = await fetch(`/api/posts`);
                if (!res.ok) {
                    notyf.error('Network error, please refresh your browser.');
                    setLoader(false);
                    return;
                }
                const jsonData = await res.json();
                setData(Array.isArray(jsonData) ? jsonData : []);
                setLoader(false);
            } catch (error) {
                console.error(error);
                setLoader(false);
            }
        };
        getData();
    }, []);

    const handleProductClick = (item) => {
        handlePro(item);
        navigation.push(`/details?title=${item.title.toLowerCase()}`);
    };

    return (
        <div className='hero-container'>
            {/* Featured Products Carousel */}
            <section className="featured-section">
                <div className="section-header">
                    <span className="section-label">Curated Selection</span>
                    <h2 className="section-title">Shop by Spirit</h2>
                    <p className="section-description">
                        Discover our handpicked collection of premium spirits
                    </p>
                </div>

                {loader ? (
                    <SkeletonR />
                ) : (
                    <div className="spirits-carousel">
                        {data?.slice(0, 6).map((item, index) => (
                            <div
                                key={item._id}
                                className="spirit-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                onClick={() => handleProductClick(item)}
                            >
                                <div className="spirit-image-wrapper">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="spirit-image"
                                    />
                                    <div className="spirit-hover-overlay">
                                        <span>View Details</span>
                                    </div>
                                </div>
                                <h3 className="spirit-name">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Best Sellers Section */}
            <section className="bestsellers-section">
                <div className="section-header">
                    <span className="section-label">Customer Favorites</span>
                    <h2 className="section-title">Best Sellers</h2>
                </div>

                <div className="bestsellers-grid">
                    <div
                        className="bestseller-featured"
                        data-aos="fade-right"
                    >
                        <img src="/images/bestsell1.jpg" alt="Best Seller 1" />
                        <div className="bestseller-overlay">
                            <span className="bestseller-badge">Top Rated</span>
                            <h3>Pappy Van Winkle</h3>
                            <p>The world's most sought-after bourbon</p>
                            <button
                                className="bestseller-btn"
                                onClick={() => navigation.push('/shop?brand=pappies')}
                            >
                                Shop Collection
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>

                    <div className="bestseller-stack">
                        <div
                            className="bestseller-item"
                            data-aos="fade-left"
                            data-aos-delay="100"
                        >
                            <img src="/images/bestsell2.jpg" alt="Best Seller 2" />
                            <div className="bestseller-overlay">
                                <h3>W.L. Weller</h3>
                                <p>Premium wheated bourbon</p>
                            </div>
                        </div>
                        <div
                            className="bestseller-item"
                            data-aos="fade-left"
                            data-aos-delay="200"
                        >
                            <img src="/images/bestsell3.jpg" alt="Best Seller 3" />
                            <div className="bestseller-overlay">
                                <h3>Buffalo Trace</h3>
                                <p>Award-winning excellence</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rated Products Grid */}
            <section className="products-section">
                <div className="section-header">
                    <span className="section-label">Highly Rated</span>
                    <h2 className="section-title">Top Rated Collection</h2>
                    <p className="section-description">
                        Premium spirits with exceptional reviews from our customers
                    </p>
                </div>

                {loader ? (
                    <SkeletonArr />
                ) : (
                    <div className="products-grid">
                        {data?.slice(0, 8).map((item, index) => (
                            <div
                                key={item._id}
                                className="product-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                <div
                                    className="product-image-wrapper"
                                    onClick={() => handleProductClick(item)}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="product-image"
                                    />
                                    <div className="product-quick-view">
                                        <span>Quick View</span>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <h3
                                        className="product-title"
                                        onClick={() => handleProductClick(item)}
                                    >
                                        {item.title}
                                    </h3>

                                    <p className="product-description">
                                        {item.content?.slice(0, 60)}...
                                    </p>

                                    <div className="product-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < 4 ? 'star-filled' : 'star-empty'}
                                            />
                                        ))}
                                        <span className="rating-text">(4.0)</span>
                                    </div>

                                    <div className="product-footer">
                                        <div className="product-price">
                                            <span className="price-label">From</span>
                                            <span className="price-value">{formatter.format(item.price)}</span>
                                        </div>

                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            <Qty productId={item._id} />
                                            <FiShoppingCart />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="products-cta">
                    <button
                        className="view-all-btn"
                        onClick={() => navigation.push('/shop')}
                    >
                        View All Products
                        <FiArrowRight />
                    </button>
                </div>
            </section>

            {/* Gift Collection */}
            <section className="gifts-section">
                <div className="section-header">
                    <span className="section-label">Perfect Presents</span>
                    <h2 className="section-title">Gift Collections</h2>
                    <p className="section-description">
                        Impress your loved ones with our exquisite gift sets
                    </p>
                </div>

                <div className="gifts-grid">
                    {[
                        { img: '/images/gift3.jpg', title: 'Premium Gift Box', desc: 'Luxury presentation' },
                        { img: '/images/gift1.jpg', title: 'Collector\'s Edition', desc: 'Rare & exclusive' },
                        { img: '/images/gift2.jpg', title: 'Tasting Set', desc: 'Curated selection' }
                    ].map((gift, index) => (
                        <div
                            key={index}
                            className="gift-card"
                            data-aos="zoom-in"
                            data-aos-delay={index * 150}
                        >
                            <div className="gift-image-wrapper">
                                <img src={gift.img} alt={gift.title} />
                            </div>
                            <div className="gift-overlay">
                                <h3>{gift.title}</h3>
                                <p>{gift.desc}</p>
                                <button className="gift-btn">
                                    Explore
                                    <FiArrowRight />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
