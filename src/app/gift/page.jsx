'use client';
import React, { useState, useEffect, useMemo, useContext, Suspense } from 'react';
import './gift.css';
import { FiFilter, FiSearch, FiGift, FiStar, FiPackage, FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../../../context/CartContext';
import { SkeletonArr2 } from '../components/Skeleton/Skeleton';
import { useRouter, useSearchParams } from 'next/navigation';

function GiftContent() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState([0, 5000]);
    const [selectedOccasions, setSelectedOccasions] = useState([]);
    const { handleAddToCart } = useContext(CartContext);
    const router = useRouter();
    const searchParams = useSearchParams();

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    useEffect(() => {
        const occParam = searchParams.get('occasion');
        if (occParam) {
            // Map slug to proper case
            const occasionMap = {
                'birthday': 'Birthday',
                'anniversary': 'Anniversary',
                'corporate': 'Corporate',
                'special': 'Special Edition'
            };
            const formattedOcc = occasionMap[occParam.toLowerCase()];
            if (formattedOcc) {
                setSelectedOccasions([formattedOcc]);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        fetchGifts();
    }, []);

    const fetchGifts = async () => {
        try {
            const res = await fetch('/api/products?model=gifts&limit=100');
            if (res.ok) {
                const data = await res.json();
                setGifts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching gifts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOccasionChange = (occ) => {
        setSelectedOccasions(prev =>
            prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
        );
    };

    const filteredGifts = useMemo(() => {
        return gifts.filter(gift => {
            const matchesSearch = gift.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = gift.price >= selectedPriceRange[0] && gift.price <= selectedPriceRange[1];
            const matchesOccasion = selectedOccasions.length === 0 || selectedOccasions.includes(gift.occasion);
            return matchesSearch && matchesPrice && matchesOccasion;
        });
    }, [gifts, searchQuery, selectedPriceRange, selectedOccasions]);

    const priceRanges = [
        { label: 'All', range: [0, 5000] },
        { label: 'Under $100', range: [0, 100] },
        { label: '$100 - $250', range: [100, 250] },
        { label: '$250 - $500', range: [250, 500] },
        { label: '$500+', range: [500, 5000] },
    ];

    const occasions = ['Birthday', 'Anniversary', 'Corporate', 'Special Edition'];

    return (
        <div className="gift-container nav-obscure-view">
            {/* Hero Section */}
            <div className="gift-hero">
                <div className="gift-hero-content">
                    <h1>Luxury Gift Bundles</h1>
                    <p>Elevate the art of giving with our exclusively curated spirit collections and premium whiskey sets.</p>
                </div>
            </div>

            <div className="gift-main">
                {/* Sidebar Filters */}
                <aside className="gift-sidebar">
                    <div className="gift-filter-section">
                        <h3><FiSearch size={18} style={{ marginRight: '8px' }} /> Search</h3>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search bundles..."
                                className="gift-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '10px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div className="gift-filter-section">
                        <h3><FiFilter size={18} style={{ marginRight: '8px' }} /> Price Range</h3>
                        <div className="gift-filter-list">
                            {priceRanges.map((range, idx) => (
                                <label key={idx} className="gift-filter-item">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={selectedPriceRange[0] === range.range[0] && selectedPriceRange[1] === range.range[1]}
                                        onChange={() => setSelectedPriceRange(range.range)}
                                    />
                                    <span>{range.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="gift-filter-section">
                        <h3><FiGift size={18} style={{ marginRight: '8px' }} /> Occasion</h3>
                        <div className="gift-filter-list">
                            {occasions.map((occ, idx) => (
                                <label key={idx} className="gift-filter-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedOccasions.includes(occ)}
                                        onChange={() => handleOccasionChange(occ)}
                                    />
                                    <span>{occ}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <section>
                    {loading ? (
                        <div className="gift-grid">
                            <SkeletonArr2 />
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Showing {filteredGifts.length} exquisite bundles {selectedOccasions.length > 0 && `for ${selectedOccasions.join(', ')}`}
                                </p>
                            </div>

                            {filteredGifts.length > 0 ? (
                                <div className="gift-grid">
                                    {filteredGifts.map((gift) => (
                                        <div
                                            key={gift._id}
                                            className="gift-card"
                                            onClick={() => router.push(`/details?title=${gift.title.toLowerCase()}`)}
                                        >
                                            {gift.isBestSeller && (
                                                <div className="gift-card-badge">Best Seller</div>
                                            )}
                                            <div className="gift-card-image">
                                                <img src={gift.img} alt={gift.title} />
                                            </div>
                                            <div className="gift-card-content">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                                    <h3 className="gift-card-title">{gift.title}</h3>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>{gift.occasion}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} fill={i < gift.rate ? "var(--color-gold)" : "none"} color="var(--color-gold)" size={14} />
                                                    ))}
                                                </div>
                                                <p className="gift-card-desc">{gift.content}</p>

                                                {gift.bundleItems?.length > 0 && (
                                                    <div style={{ marginBottom: '15px' }}>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '5px', fontWeight: '600' }}>Includes:</p>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                                            {gift.bundleItems.slice(0, 3).map((item, i) => (
                                                                <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '5px', color: 'var(--color-gold)' }}>
                                                                    {item}
                                                                </span>
                                                            ))}
                                                            {gift.bundleItems.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>+{gift.bundleItems.length - 3} more</span>}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="gift-card-footer">
                                                    <span className="gift-card-price">{formatter.format(gift.price)}</span>
                                                    <button
                                                        className="gift-add-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddToCart(gift);
                                                        }}
                                                    >
                                                        Add to Collection
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <FiPackage size={60} color="var(--color-border)" />
                                    <h3 style={{ marginTop: '20px', color: 'var(--color-text-secondary)' }}>No bundles found matching your criteria</h3>
                                    <button
                                        onClick={() => {
                                            setSelectedOccasions([]);
                                            setSelectedPriceRange([0, 5000]);
                                            setSearchQuery('');
                                        }}
                                        style={{
                                            marginTop: '20px',
                                            background: 'none',
                                            border: '1px solid var(--color-gold)',
                                            color: 'var(--color-gold)',
                                            padding: '8px 20px',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Clear and Show All
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default function GiftPage() {
    return (
        <Suspense fallback={<div className="gift-container nav-obscure-view"><div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="dashboard-spinner"></div></div></div>}>
            <GiftContent />
        </Suspense>
    );
}
