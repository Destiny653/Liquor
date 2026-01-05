'use client';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    FiUser, FiPackage, FiSettings, FiLogOut,
    FiMail, FiCalendar, FiMapPin, FiPhone,
    FiChevronRight, FiShoppingBag, FiClock
} from 'react-icons/fi';
import './profile.css';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch(`/api/orders?email=${session.user.email}`);
                    const data = await res.json();
                    if (data.success) {
                        setOrders(data.order || []);
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (session) {
            fetchOrders();
        }
    }, [session]);

    if (status === 'loading' || loading) {
        return (
            <div className='profile-loader-overlay'>
                <div className='profile-loader'></div>
            </div>
        );
    }

    if (!session) return null;

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className='profile-page nav-obscure-view'>
            <div className='profile-container'>
                {/* Profile Header Card */}
                <div className='profile-header-card'>
                    <div className='profile-cover'></div>
                    <div className='profile-header-content'>
                        <div className='profile-avatar-wrapper'>
                            <img
                                src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=d4af37&color=fff`}
                                alt={session.user.name}
                                className='profile-avatar'
                            />
                            <div className='profile-status-dot'></div>
                        </div>
                        <div className='profile-info'>
                            <h1 className='profile-name'>{session.user.name}</h1>
                            <p className='profile-email'>
                                <FiMail size={14} className='inline mr-2' />
                                {session.user.email}
                            </p>
                            <div className='profile-badges'>
                                <span className='profile-badge'>
                                    {session.user.role === 'manager' ? 'Admin' : 'Preferred Customer'}
                                </span>
                                <span className='profile-badge secondary'>Member since 2024</span>
                            </div>
                        </div>
                        <div className='profile-header-actions'>
                            <button className='profile-edit-btn'>Edit Profile</button>
                            <button onClick={() => signOut()} className='profile-logout-btn'>
                                <FiLogOut />
                            </button>
                        </div>
                    </div>
                </div>

                <div className='profile-layout'>
                    {/* Sidebar Nav */}
                    <aside className='profile-sidebar'>
                        <nav className='profile-nav'>
                            <button
                                className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveTab('orders')}
                            >
                                <FiPackage /> My Orders
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <FiSettings /> Account Settings
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'address' ? 'active' : ''}`}
                                onClick={() => setActiveTab('address')}
                            >
                                <FiMapPin /> Saved Addresses
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className='profile-main'>
                        {activeTab === 'orders' && (
                            <div className='profile-tab-content'>
                                <div className='section-header'>
                                    <h2 className='section-title'>Order History</h2>
                                    <span className='section-subtitle'>{orders.length} total orders</span>
                                </div>

                                {orders.length > 0 ? (
                                    <div className='order-list'>
                                        {orders.map((order, idx) => (
                                            <div key={idx} className='order-card'>
                                                <div className='order-header'>
                                                    <div className='order-id-group'>
                                                        <span className='order-label'>Order</span>
                                                        <span className='order-id'>#{order._id.slice(-8)}</span>
                                                    </div>
                                                    <div className='order-status-badge' data-status='processing'>
                                                        Processing
                                                    </div>
                                                </div>
                                                <div className='order-body'>
                                                    {order.orders?.map((item, i) => (
                                                        <div key={i} className='order-items-summary'>
                                                            <div className='order-date'>
                                                                <FiCalendar size={14} className='mr-2' />
                                                                {new Date(item.orderDate || Date.now()).toLocaleDateString()}
                                                            </div>
                                                            <div className='order-total'>
                                                                {formatter.format(item.totalPrice)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button className='order-view-btn'>
                                                    View Details <FiChevronRight />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='empty-state'>
                                        <div className='empty-icon'>
                                            <FiShoppingBag />
                                        </div>
                                        <h3>No orders yet</h3>
                                        <p>Your premium collection awaits. Start exploring our selection.</p>
                                        <button onClick={() => router.push('/shop')} className='explore-btn'>
                                            Browse Shop
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className='profile-tab-content'>
                                <div className='section-header'>
                                    <h2 className='section-title'>Account Settings</h2>
                                </div>
                                <div className='settings-grid'>
                                    <div className='settings-card'>
                                        <h3>Personal Information</h3>
                                        <div className='form-group'>
                                            <label>Full Name</label>
                                            <input type='text' defaultValue={session.user.name} />
                                        </div>
                                        <div className='form-group'>
                                            <label>Email Address</label>
                                            <input type='email' defaultValue={session.user.email} disabled />
                                        </div>
                                        <button className='save-btn'>Update Info</button>
                                    </div>
                                    <div className='settings-card'>
                                        <h3>Security</h3>
                                        <p className='settings-text'>Manage your password and security settings.</p>
                                        <button className='secondary-btn'>Change Password</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

