'use client';
import React, { useContext, useEffect, useState, useRef } from 'react';
import './Navbar.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchContext } from '../../../../context/SearchContext';
import { CartContext } from '../../../../context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import Display from '../SearchDisplay/Display';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
    const { setSearchVal } = useContext(SearchContext);
    const { cartItems } = useContext(CartContext);

    // Calculate total cart items
    const totalCartItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const { data: session, status } = useSession();
    const navigation = useRouter();

    // Brand and Mega Menu data
    const [brands, setBrands] = useState([]);
    const [megaGifts, setMegaGifts] = useState([]);
    const [megaProducts, setMegaProducts] = useState([]);
    const [loadingMega, setLoadingMega] = useState(false);


    useEffect(() => {
        const fetchNavbarData = async () => {
            setLoadingMega(true);
            try {
                // Fetch Brands
                const brandsRes = await fetch('/api/product-models');
                if (brandsRes.ok) {
                    const data = await brandsRes.json();
                    setBrands(data.map(brand => ({
                        name: brand.label,
                        slug: brand.value,
                        description: brand.description || 'Premium selection',
                        image: brand.image || 'https://images.unsplash.com/photo-1569158062037-d86260ef3fa9?q=80&w=2000&auto=format&fit=crop'
                    })));
                }

                // Fetch Mega Menu Products (Top 12)
                const productsRes = await fetch('/api/products?limit=12');
                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setMegaProducts(data.products || []);
                }

                // Fetch Mega Menu Gifts (Top 12)
                const giftsRes = await fetch('/api/products?occasion=Gift&limit=12');
                if (giftsRes.ok) {
                    const data = await giftsRes.json();
                    setMegaGifts(data.products || []);
                }
            } catch (error) {
                console.error('Error fetching navbar data:', error);
            } finally {
                setLoadingMega(false);
            }
        };

        fetchNavbarData();

        const handleBrandUpdate = () => fetchNavbarData();
        window.addEventListener('brandDataUpdated', handleBrandUpdate);
        return () => window.removeEventListener('brandDataUpdated', handleBrandUpdate);
    }, []);


    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };


    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Shop', path: '/shop', hasMega: true, type: 'shop' },
        { title: 'Gifts', path: '/gift', hasMega: true, type: 'gifts' },
        { title: 'About', path: '/about' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const megaMenuRef = useRef(null);
    const megaMenuTimeoutRef = useRef(null);

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsScrolled(currentScrollY > 50);

            if (currentScrollY < 150) {
                setIsVisible(true);
            } else {
                setIsVisible(currentScrollY < lastScrollY);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Search functionality
    const fetchFromAPIs = async (title) => {
        if (!title) return [];
        try {
            const res = await fetch(`/api/products?limit=20`);
            if (res.ok) {
                const data = await res.json();
                const products = data.products || [];
                return products.filter(product =>
                    product?.title?.toLowerCase().includes(title.toLowerCase())
                );
            }
            return [];
        } catch (error) {
            console.error("Search error:", error);
            return [];
        }
    };
    useEffect(() => {
        if (query) {
            fetchFromAPIs(query).then(results => setSearchVal(results));
        }
    }, [query, setSearchVal]);

    // Handle mega menu hover with delay
    const handleMegaMenuEnter = (type) => {
        if (megaMenuTimeoutRef.current) {
            clearTimeout(megaMenuTimeoutRef.current);
        }
        setActiveMegaMenu(type);
        setMegaMenuOpen(true);
    };

    const handleMegaMenuLeave = () => {
        megaMenuTimeoutRef.current = setTimeout(() => {
            setMegaMenuOpen(false);
            setActiveMegaMenu(null);
        }, 150);
    };

    // Navigate to product details
    const handleProductClick = (productId) => {
        setMegaMenuOpen(false);
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
        navigation.push(`/details?id=${productId}`);
    };


    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMegaMenuOpen(false);
    }, []);

    return (
        <>
            <header
                className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}
            >
                {/* Top Bar */}
                <div className="top-bar">
                    <div className="top-bar-content">
                        <span className="top-bar-text">
                            🥃 Free Shipping on Orders Over $500 | Premium Selection Guaranteed
                        </span>
                        {session && (
                            <div className="top-bar-right">
                                <Link href="/profile" className="top-bar-user">
                                    <FiUser className="user-icon" />
                                    <div className="user-details">
                                        <span className="user-name">{session.user?.name || 'My Profile'}</span>
                                        <span className="user-email">{session.user?.email}</span>
                                    </div>
                                </Link>
                                <button onClick={() => signOut()} className="top-bar-logout" title="Sign Out">
                                    <FiLogOut />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="main-nav">
                    <div className="nav-container">
                        {/* Logo */}
                        <Link href="/" className="nav-logo">
                            <span className="logo-text">LIQUOR</span>
                            <span className="logo-accent">LUXX</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <ul className="nav-links-desktop">
                            {navLinks.map((link, index) => (
                                <li
                                    key={index}
                                    className={`nav-link-item ${link.hasMega ? 'has-mega' : ''}`}
                                    onMouseEnter={link.hasMega ? () => handleMegaMenuEnter(link.type) : undefined}
                                    onMouseLeave={link.hasMega ? handleMegaMenuLeave : undefined}
                                >
                                    <Link href={link.path} className="nav-link">
                                        {link.title}
                                        {link.hasMega && <FiChevronDown className={`chevron ${megaMenuOpen && activeMegaMenu === link.type ? 'rotate' : ''}`} />}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Right Side Actions */}
                        <div className="nav-actions">
                            {/* Search */}
                            <div className={`search-container ${searchOpen ? 'open' : ''}`}>
                                <button
                                    className="nav-action-btn search-toggle"
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    aria-label="Search"
                                >
                                    <FiSearch />
                                </button>
                                <div className="search-dropdown">
                                    <input
                                        type="text"
                                        placeholder="Search premium spirits..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    <Display />
                                </div>
                            </div>

                            {/* Cart */}
                            <Link href="/cart" className="nav-action-btn cart-btn">
                                <FiShoppingCart />
                                {totalCartItems > 0 && (
                                    <span className="cart-badge">{totalCartItems}</span>
                                )}
                            </Link>

                            {/* User Profile / Dashboard / Orders */}
                            <div className="user-nav-group">
                                {session && session.user?.role === 'manager' && (
                                    <Link href="/dashboard/posts" className="nav-action-btn dashboard-link" title="Admin Dashboard">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px' }}>
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                        </svg>
                                    </Link>
                                )}

                                <Link
                                    href={session ? "/profile" : "/login"}
                                    className="nav-action-btn user-btn"
                                    title={session ? "My Profile" : "Sign In"}
                                >
                                    {session?.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name}
                                            className="user-avatar"
                                        />
                                    ) : (
                                        <FiUser />
                                    )}
                                </Link>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="nav-action-btn mobile-toggle"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? <FiX /> : <FiMenu />}
                            </button>
                        </div>
                    </div>
                </nav>

                <div
                    ref={megaMenuRef}
                    className={`mega-menu ${megaMenuOpen ? 'open' : ''}`}
                    onMouseEnter={() => handleMegaMenuEnter(activeMegaMenu)}
                    onMouseLeave={handleMegaMenuLeave}
                >
                    <div className="mega-menu-container">
                        <div className="mega-menu-header">
                            <h3>{activeMegaMenu === 'shop' ? 'Our Premium Brands' : 'Gifts by Occasion'}</h3>
                            <p>{activeMegaMenu === 'shop' ? 'Discover our curated collection of world-class spirits' : 'Find the perfect gift for every milestone'}</p>
                        </div>
                        <div className="mega-menu-grid">
                            {loadingMega ? (
                                <div className="mega-menu-loader">Loading...</div>
                            ) : activeMegaMenu === 'shop' ? (
                                megaProducts.map((product, index) => (
                                    <div
                                        key={index}
                                        className="mega-menu-item"
                                        onClick={() => handleProductClick(product._id)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="mega-item-image">
                                            <img src={product.img} alt={product.title} />
                                            <div className="mega-item-overlay"></div>
                                        </div>
                                        <div className="mega-item-content">
                                            <h4>{product.title}</h4>
                                            <p>{truncateText(product.content)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                megaGifts.map((gift, index) => (
                                    <div
                                        key={index}
                                        className="mega-menu-item"
                                        onClick={() => handleProductClick(gift._id)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="mega-item-image">
                                            <img src={gift.img} alt={gift.title} />
                                            <div className="mega-item-overlay"></div>
                                        </div>
                                        <div className="mega-item-content">
                                            <h4>{gift.title}</h4>
                                            <p>{truncateText(gift.content)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mega-menu-footer">
                            <Link href={activeMegaMenu === 'shop' ? "/shop" : "/gift"} className="view-all-btn" onClick={() => setMegaMenuOpen(false)}>
                                {activeMegaMenu === 'shop' ? "View All Products" : "Explore All Gifts"}
                                <span className="btn-arrow">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    {/* Mobile Search */}
                    <div className="mobile-search">
                        <FiSearch className="mobile-search-icon" />
                        <input
                            type="text"
                            placeholder="Search premium spirits..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Mobile Nav Links */}
                    <ul className="mobile-nav-links">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link
                                    href={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                        {session && session.user?.role === 'manager' && (
                            <li>
                                <Link
                                    href="/dashboard/posts"
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ color: 'var(--nav-gold)' }}
                                >
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Mobile Products */}
                    <div className="mobile-brands">
                        <h3>Our Products</h3>
                        <div className="mobile-brands-grid">
                            {megaProducts.slice(0, 8).map((product, index) => (
                                <button
                                    key={index}
                                    className="mobile-brand-btn"
                                    onClick={() => handleProductClick(product._id)}
                                >
                                    {product.title}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Mobile Gifts */}
                    <div className="mobile-brands" style={{ marginTop: '20px' }}>
                        <h3>Featured Gifts</h3>
                        <div className="mobile-brands-grid">
                            {megaGifts.slice(0, 8).map((gift, index) => (
                                <button
                                    key={index}
                                    className="mobile-brand-btn"
                                    onClick={() => handleProductClick(gift._id)}
                                >
                                    {gift.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile User Actions */}
                    <div className="mobile-actions">
                        <Link href="/cart" className="mobile-action-btn" onClick={() => setMobileMenuOpen(false)}>
                            <FiShoppingCart />
                            <span>Cart</span>
                        </Link>
                        <Link
                            href={session ? "/profile" : "/login"}
                            className="mobile-action-btn"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FiUser />
                            <span>{session ? 'Profile' : 'Login'}</span>
                        </Link>
                        {session && (
                            <button
                                className="mobile-action-btn logout-btn"
                                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--nav-text)' }}
                            >
                                <FiLogOut />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from going under fixed navbar */}
            <div className="navbar-spacer"></div>
        </>
    );
}
