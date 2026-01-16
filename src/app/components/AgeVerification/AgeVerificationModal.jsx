'use client';
import { useState, useEffect } from 'react';
import './age-verification.css';

export default function AgeVerificationModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        // Check if age is already verified
        const verified = localStorage.getItem('ageVerified');
        if (!verified) {
            setIsVisible(true);
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem('ageVerified', 'true');
        setIsVisible(false);
        // Re-enable scrolling
        document.body.style.overflow = 'unset';
    };

    const handleDeny = () => {
        setIsBlocked(true);
    };

    if (!isVisible) return null;

    return (
        <div className="age-modal-overlay">
            <div className="age-modal-content">
                <div className="age-modal-logo">
                    LIQUOR<span>LUXX</span>
                </div>

                {!isBlocked ? (
                    <>
                        <h2 className="age-modal-title">Age Verification</h2>
                        <p className="age-modal-message">
                            You must be of legal drinking age to enter this site.
                            <br />
                            Are you 21 years of age or older?
                        </p>
                        <div className="age-modal-actions">
                            <button className="age-btn age-btn-deny" onClick={handleDeny}>
                                No, I am not
                            </button>
                            <button className="age-btn age-btn-confirm" onClick={handleConfirm}>
                                Yes, I am 21+
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="age-modal-blocked-content">
                        <h2 className="age-modal-title">Access Denied</h2>
                        <p className="age-modal-message">
                            We are sorry, but you must be of legal drinking age to purchase from our site.
                        </p>
                        <p className="age-modal-blocked">
                            Return when you are 21.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
