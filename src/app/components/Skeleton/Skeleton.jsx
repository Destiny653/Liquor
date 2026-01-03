import React from 'react';
import './Skeleton.css';

// Circular skeleton for spirit cards
export default function SkeletonR() {
    return (
        <section className='skeleton-spirits'>
            {[...Array(6)].map((_, index) => (
                <div key={index} className='skeleton-spirit-item'>
                    <div className="skeleton-circle"></div>
                    <div className='skeleton-text'></div>
                </div>
            ))}
        </section>
    );
}

// Product card skeleton grid
export function SkeletonArr() {
    return (
        <section className='skeleton-products'>
            {[...Array(8)].map((_, index) => (
                <div key={index} className="skeleton-product-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-desc"></div>
                        <div className="skeleton-price"></div>
                    </div>
                </div>
            ))}
        </section>
    );
}

// Shop page skeleton grid
export function SkeletonArr2() {
    return (
        <>
            {[...Array(8)].map((_, index) => (
                <div key={index} className="skeleton-product-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-desc"></div>
                        <div className="skeleton-price"></div>
                    </div>
                </div>
            ))}
        </>
    );
}

// Full page loader
export const Load = () => {
    return (
        <div className='loader-overlay'>
            <div className="loader-container">
                <div className="loader-spinner"></div>
                <p className="loader-text">Loading...</p>
            </div>
        </div>
    );
};
