'use client';
import React, { useState, Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiUser, FiLock, FiBell, FiShield, FiSave } from 'react-icons/fi';
import { Notyf } from 'notyf';

function SettingsContent() {
    const [loading, setLoading] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
            notyf.success('Settings saved successfully');
        }, 1000);
    };

    return (
        <DashboardLayout>
            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Settings</h1>
                    <p>Manage your account preferences and store settings</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
                {/* Settings Sidebar */}
                <div className='dashboard-card' style={{ height: 'fit-content', padding: '16px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            { icon: FiUser, label: 'Account', active: true },
                            { icon: FiLock, label: 'Security', active: false },
                            { icon: FiBell, label: 'Notifications', active: false },
                            { icon: FiShield, label: 'Admin Roles', active: false },
                        ].map((item, i) => (
                            <button
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '12px 24px',
                                    background: item.active ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                    border: 'none',
                                    borderLeft: `3px solid ${item.active ? 'var(--color-gold)' : 'transparent'}`,
                                    color: item.active ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    width: '100%'
                                }}
                            >
                                <item.icon />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Form */}
                <div className='dashboard-card'>
                    <div className='dashboard-card-header'>
                        <h3 className='dashboard-card-title'>Profile Settings</h3>
                    </div>

                    <form onSubmit={handleSave} style={{ padding: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                            <img
                                src='https://via.placeholder.com/100'
                                alt='Profile'
                                style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--color-border)' }}
                            />
                            <div>
                                <button type='button' style={{
                                    padding: '8px 16px',
                                    background: 'var(--color-bg-primary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 6,
                                    color: 'var(--color-text-primary)',
                                    fontSize: 13,
                                    cursor: 'pointer'
                                }}>
                                    Change Avatar
                                </button>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
                                    JPG, GIF or PNG. Max size of 800K
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>First Name</label>
                                <input
                                    type='text'
                                    defaultValue='John'
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 8,
                                        color: 'var(--color-text-primary)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Last Name</label>
                                <input
                                    type='text'
                                    defaultValue='Doe'
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 8,
                                        color: 'var(--color-text-primary)',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Email Address</label>
                            <input
                                type='email'
                                defaultValue='john.doe@example.com'
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 8,
                                    color: 'var(--color-text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Bio</label>
                            <textarea
                                rows={4}
                                defaultValue='Senior administrator for LiquorLuxx platform.'
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 8,
                                    color: 'var(--color-text-primary)',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                background: 'var(--gradient-accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            {loading ? 'Saving...' : <><FiSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className='dashboard-loader'>
                <div className='dashboard-spinner'></div>
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
