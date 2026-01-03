'use client';
import React from 'react';
import "./footer.css";
import {
    PiInstagramLogo,
    PiFacebookLogo,
    PiTwitterLogo,
    PiEnvelope,
    PiPhone,
    PiMapPin,
    PiMedal,
    PiTruck,
    PiShieldCheck,
    PiUsers
} from "react-icons/pi";
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const brands = [
        { name: 'Pappy Van Winkle', slug: 'pappies' },
        { name: 'W.L. Weller', slug: 'wellers' },
        { name: 'Buffalo Trace', slug: 'buffalos' },
        { name: 'Yamazaki', slug: 'yamazakis' },
        { name: 'Penelope', slug: 'penelopes' },
        { name: 'Baltons', slug: 'baltons' },
    ];

    const customerLinks = [
        { name: 'My Account', href: '/login' },
        { name: 'Order History', href: '/orders' },
        { name: 'Track Order', href: '/orders' },
        { name: 'Wishlist', href: '/shop' },
    ];

    const companyLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/about' },
        { name: 'Press', href: '/about' },
    ];

    const features = [
        { icon: <PiMedal />, title: 'Premium Selection', desc: '#1 Supplier of Top Shelf Liquor' },
        { icon: <PiTruck />, title: 'Fast Shipping', desc: 'Free on orders over $500' },
        { icon: <PiShieldCheck />, title: 'Secure Packaging', desc: 'Arrives safely guaranteed' },
        { icon: <PiUsers />, title: 'Family Owned', desc: 'Since 1995' },
    ];

    return (
        <footer className='footer-wrapper'>
            {/* Features Bar */}
            <div className='footer-features'>
                {features.map((feature, index) => (
                    <div key={index} className='footer-feature'>
                        <span className='feature-emoji'>{feature.icon}</span>
                        <div className='feature-content'>
                            <h4>{feature.title}</h4>
                            <p>{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Footer Content */}
            <div className='footer-main'>
                <div className='footer-container'>
                    {/* Brand Column */}
                    <div className='footer-column footer-brand'>
                        <Link href="/" className='footer-logo'>
                            <span className='logo-text'>LIQUOR</span>
                            <span className='logo-accent'>LUXX</span>
                        </Link>
                        <p className='footer-tagline'>
                            Premium spirits delivered to your door. Experience the finest
                            collection of rare and exclusive liquors.
                        </p>
                        <div className='footer-social'>
                            <a href="#" className='social-link' aria-label="Instagram">
                                <PiInstagramLogo />
                            </a>
                            <a href="#" className='social-link' aria-label="Facebook">
                                <PiFacebookLogo />
                            </a>
                            <a href="#" className='social-link' aria-label="Twitter">
                                <PiTwitterLogo />
                            </a>
                        </div>
                    </div>

                    {/* Shop by Brand Column */}
                    <div className='footer-column'>
                        <h3 className='footer-heading'>Shop by Brand</h3>
                        <ul className='footer-links'>
                            {brands.map((brand, index) => (
                                <li key={index}>
                                    <Link href={`/shop?brand=${brand.slug}`}>
                                        {brand.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service Column */}
                    <div className='footer-column'>
                        <h3 className='footer-heading'>Customer Service</h3>
                        <ul className='footer-links'>
                            {customerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className='footer-column'>
                        <h3 className='footer-heading'>Company</h3>
                        <ul className='footer-links'>
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className='footer-column'>
                        <h3 className='footer-heading'>Contact Us</h3>
                        <ul className='footer-contact'>
                            <li>
                                <PiPhone className='contact-icon' />
                                <span>+1 (688) 388-937</span>
                            </li>
                            <li>
                                <PiEnvelope className='contact-icon' />
                                <span>support@liquorluxx.com</span>
                            </li>
                            <li>
                                <PiMapPin className='contact-icon' />
                                <span>123 Premium Ave, NY 10001</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className='footer-bottom'>
                <div className='footer-bottom-container'>
                    <p className='copyright'>
                        © {currentYear} LiquorLuxx. All rights reserved.
                    </p>
                    <div className='footer-legal'>
                        <Link href='/policies/privacy-policy'>Privacy Policy</Link>
                        <span className='divider'>|</span>
                        <Link href='/policies/terms-and-condition-policy'>Terms & Conditions</Link>
                        <span className='divider'>|</span>
                        <Link href='/policies/shipping-policy'>Shipping Policy</Link>
                        <span className='divider'>|</span>
                        <Link href='/policies/refund-policy'>Refund Policy</Link>
                    </div>
                    <p className='age-disclaimer'>
                        You must be 21 years or older to purchase from this site.
                    </p>
                </div>
            </div>
        </footer>
    );
}
