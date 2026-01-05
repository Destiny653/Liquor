'use client';
import React, { useContext, useEffect, useMemo } from 'react';
import { SearchContext } from '../../../context/SearchContext';
import { CartContext } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import Qty from '../components/Quantity/quantity';
import {
    FiShoppingCart,
    FiHeart,
    FiShield,
    FiTruck,
    FiInfo,
    FiStar,
    FiAward,
    FiCoffee,
    FiWind,
    FiPackage
} from 'react-icons/fi';
import './details.css';

export default function Page() {
    const { detailPro, api, handlePro } = useContext(SearchContext);
    const { handleAddToCart } = useContext(CartContext);
    const navigation = useRouter();

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // Handle scroll to top when product changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [detailPro]);

    // Simulated specifications based on product title or default
    const specs = useMemo(() => {
        const isWhiskey = detailPro?.title?.toLowerCase().includes('whiskey') ||
            detailPro?.title?.toLowerCase().includes('bourbon') ||
            detailPro?.title?.toLowerCase().includes('scotch');

        return {
            origin: isWhiskey ? "Kentucky, USA" : "Global Collection",
            abv: isWhiskey ? "45.0% - 52.0%" : "40.0%",
            size: "750ml",
            age: isWhiskey ? "12 Years Minimum" : "N/A",
            type: isWhiskey ? "Premium Spirit" : "Limited Edition",
            category: detailPro?.productModel || "Reserve"
        };
    }, [detailPro]);

    const suggestions = useMemo(() => {
        if (!api) return [];
        return api
            .filter(item => item._id !== detailPro?._id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [api, detailPro]);

    if (!detailPro || Object.keys(detailPro).length === 0) {
        return (
            <div className="nav-obscure-view" style={{ textAlign: 'center', padding: '100px' }}>
                <FiPackage size={50} color="var(--color-gold)" style={{ marginBottom: '20px' }} />
                <h2 style={{ color: 'white' }}>Product not found</h2>
                <button
                    onClick={() => navigation.push('/shop')}
                    style={{ marginTop: '20px', color: 'var(--color-gold)', background: 'none', border: '1px solid var(--color-gold)', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <div className='details-wrapper nav-obscure-view'>
            <div className='details-main'>
                {/* Left: Image Section */}
                <section className='details-image-section'>
                    <div className='details-image-container'>
                        <img src={detailPro?.img} alt={detailPro?.title} />
                    </div>
                </section>

                {/* Right: Info Section */}
                <section className='details-info-section'>
                    <div className='details-badge'>
                        <FiAward size={14} /> Rare Reserve Edition
                    </div>

                    <h1 className='details-title'>{detailPro?.title}</h1>

                    <div className='details-meta'>
                        <div className='details-rating'>
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} fill={i < (detailPro?.rate || 5) ? "var(--color-gold)" : "none"} />
                            ))}
                            <span style={{ marginLeft: '10px', color: 'var(--color-text-muted)' }}>(120+ Reviews)</span>
                        </div>
                        <span style={{ color: 'var(--color-border)' }}>|</span>
                        <div style={{ color: 'var(--color-gold)', fontWeight: '600' }}>In Stock</div>
                    </div>

                    <div className='details-price'>{formatter.format(detailPro?.price)}</div>

                    <p className='details-description'>
                        {detailPro?.content || "Experience the pinnacle of craftsmanship with this exceptional selection from our private reserve. Each bottle tells a story of heritage, patience, and uncompromising quality."}
                    </p>

                    <div className='details-cta-row'>
                        <button className='details-add-btn' onClick={() => { handleAddToCart(detailPro); }}>
                            <div className='qty-p-i'>
                                <FiShoppingCart size={20} />
                                <Qty productId={detailPro?._id} />
                            </div>
                            ADD TO COLLECTION
                        </button>
                        <button className='details-wishlist-btn'>
                            <FiHeart size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            <FiTruck color='var(--color-gold)' /> Secure Global Shipping
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            <FiShield color='var(--color-gold)' /> Verified Authenticity
                        </div>
                    </div>

                    {/* Rich Details Tabs/Grid */}
                    <div className='details-content-grid'>
                        <div className='details-content-card'>
                            <h3><FiInfo /> Specifications</h3>
                            <div className='details-spec-list'>
                                <div className='details-spec-item'>
                                    <span className='details-spec-label'>Origin</span>
                                    <span className='details-spec-value'>{specs.origin}</span>
                                </div>
                                <div className='details-spec-item'>
                                    <span className='details-spec-label'>ABV / Proof</span>
                                    <span className='details-spec-value'>{specs.abv}</span>
                                </div>
                                <div className='details-spec-item'>
                                    <span className='details-spec-label'>Volume</span>
                                    <span className='details-spec-value'>{specs.size}</span>
                                </div>
                                <div className='details-spec-item'>
                                    <span className='details-spec-label'>Age Statement</span>
                                    <span className='details-spec-value'>{specs.age}</span>
                                </div>
                            </div>
                        </div>

                        <div className='details-content-card'>
                            <h3><FiWind /> Tasting Notes</h3>
                            <div className='tasting-notes-grid'>
                                <div className='tasting-note-item'>
                                    <div className='tasting-note-icon'><FiWind /></div>
                                    <div className='tasting-note-label'>Nose</div>
                                    <div className='tasting-note-value'>Oak & Caramel</div>
                                </div>
                                <div className='tasting-note-item'>
                                    <div className='tasting-note-icon'><FiCoffee /></div>
                                    <div className='tasting-note-label'>Palate</div>
                                    <div className='tasting-note-value'>Toasted Spice</div>
                                </div>
                                <div className='tasting-note-item'>
                                    <div className='tasting-note-icon'><FiWind /></div>
                                    <div className='tasting-note-label'>Finish</div>
                                    <div className='tasting-note-value'>Long & Warm</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Suggestions */}
            <section className='details-suggestions'>
                <h2>You May Also Experience</h2>
                <div className='suggestions-grid'>
                    {suggestions.map((item) => (
                        <div
                            key={item._id}
                            className='suggestion-card'
                            onClick={() => { handlePro(item); navigation.push(`/details?title=${item.title.toLowerCase()}`) }}
                        >
                            <img src={item.img} alt={item.title} className='suggestion-img' />
                            <h3 className='suggestion-title'>{item.title}</h3>
                            <div className='details-rating' style={{ justifyContent: 'center', marginBottom: '10px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} size={12} fill={i < item.rate ? "var(--color-gold)" : "none"} />
                                ))}
                            </div>
                            <div className='suggestion-price'>{formatter.format(item.price)}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
