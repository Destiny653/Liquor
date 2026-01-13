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

    // Brand data for mega menu
    const brands = [
        {
            name: 'Pappy Van Winkle',
            slug: 'pappies',
            description: 'The most sought-after bourbon in the world',
            image: '/images/bestsell1.jpg'
        },
        {
            name: 'W.L. Weller',
            slug: 'wellers',
            description: 'Premium wheated bourbon collection',
            image: '/images/bestsell2.jpg'
        },
        {
            name: 'Buffalo Trace',
            slug: 'buffalos',
            description: 'Award-winning Kentucky straight bourbon',
            image: '/images/bestsell3.jpg'
        },
        {
            name: 'Yamazaki',
            slug: 'yamazakis',
            description: 'Japanese whisky excellence',
            image: '/images/gift1.jpg'
        },
        {
            name: 'Penelope',
            slug: 'penelopes',
            description: 'Crafted four-grain bourbon',
            image: '/images/gift2.jpg'
        },
        {
            name: 'Blantons',
            slug: 'blantons',
            description: 'Distinguished single malt selection',
            image: '/images/gift3.jpg'
        },
        {
            name: 'Gift Bundles',
            slug: 'gifts',
            description: 'Exclusive curated spirit sets and sets',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop'
        }
    ];

    const occasions = [
        {
            name: 'Birthday',
            slug: 'birthday',
            description: 'Celebrate another year with a premium selection',
            image: 'https://images.unsplash.com/photo-1530103862676-fa8c91abe178?q=80&w=2070&auto=format&fit=crop'
        },
        {
            name: 'Anniversary',
            slug: 'anniversary',
            description: 'Toast to everlasting love and memories',
            image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop'
        },
        {
            name: 'Corporate',
            slug: 'corporate',
            description: 'Make a lasting impression on partners',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2074&auto=format&fit=crop'
        },
        {
            name: 'Special Edition',
            slug: 'special',
            description: 'Rare finds for the ultimate collector',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
        }
    ];

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
        const apis = ['/api/posts'];
        const fetchPromises = apis.map(api => fetch(api).then(res => res.json()));
        const results = await Promise.all(fetchPromises);
        return results.flat().filter(product =>
            product?.title?.toLowerCase().includes(title.toLowerCase())
        );
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

    // Navigate to shop with brand filter
    const handleBrandClick = (brandSlug) => {
        setMegaMenuOpen(false);
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
        navigation.push(`/shop?brand=${brandSlug}`);
    };

    // Navigate to gift with occasion filter
    const handleOccasionClick = (occasionSlug) => {
        setMegaMenuOpen(false);
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
        navigation.push(`/gift?occasion=${occasionSlug}`);
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
                            {activeMegaMenu === 'shop' ? (
                                brands.map((brand, index) => (
                                    <div
                                        key={index}
                                        className="mega-menu-item"
                                        onClick={() => handleBrandClick(brand.slug)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="mega-item-image">
                                            <img src={brand.image} alt={brand.name} />
                                            <div className="mega-item-overlay"></div>
                                        </div>
                                        <div className="mega-item-content">
                                            <h4>{brand.name}</h4>
                                            <p>{brand.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                occasions.map((occ, index) => (
                                    <div
                                        key={index}
                                        className="mega-menu-item"
                                        onClick={() => handleOccasionClick(occ.slug)}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="mega-item-image">
                                            <img src={occ.image} alt={occ.name} />
                                            <div className="mega-item-overlay"></div>
                                        </div>
                                        <div className="mega-item-content">
                                            <h4>{occ.name}</h4>
                                            <p>{occ.description}</p>
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

                    {/* Mobile Brands */}
                    <div className="mobile-brands">
                        <h3>Shop by Brand</h3>
                        <div className="mobile-brands-grid">
                            {brands.map((brand, index) => (
                                <button
                                    key={index}
                                    className="mobile-brand-btn"
                                    onClick={() => handleBrandClick(brand.slug)}
                                >
                                    {brand.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Occasions */}
                    <div className="mobile-brands" style={{ marginTop: '20px' }}>
                        <h3>Gifts by Occasion</h3>
                        <div className="mobile-brands-grid">
                            {occasions.map((occ, index) => (
                                <button
                                    key={index}
                                    className="mobile-brand-btn"
                                    onClick={() => handleOccasionClick(occ.slug)}
                                >
                                    {occ.name}
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
