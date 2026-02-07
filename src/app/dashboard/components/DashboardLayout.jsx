'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    FiHome, FiPackage, FiPlusCircle, FiSettings,
    FiUsers, FiShoppingCart, FiBarChart2, FiLogOut,
    FiMenu, FiX, FiMessageSquare, FiTag, FiSearch, FiBell
} from 'react-icons/fi';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { signOut, useSession } from 'next-auth/react';
import '../dashboard.css';

export default function DashboardLayout({ children }) {
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?limit=10');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [session]);

    const handleMarkAsRead = async (id, link) => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ notificationId: id })
            });
            // Optimistic update
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));

            if (link) {
                setShowNotifications(false);
                router.push(link);
            }
        } catch (error) {
            console.error('Error marking read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ markAllRead: true })
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    };

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('dashboard_sidebar_collapsed');
        if (stored) setSidebarCollapsed(stored === 'true');
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('dashboard_sidebar_collapsed', String(sidebarCollapsed));
        }
    }, [sidebarCollapsed, mounted]);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) setSearchQuery(query);
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to products page with search query
            router.push(`/dashboard/posts?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const navItems = [
        {
            section: 'Main',
            items: [
                { name: 'Dashboard', path: '/dashboard/analytics', icon: FiHome },
                { name: 'Products', path: '/dashboard/posts', icon: FiPackage },
                { name: 'Add Product', path: '/dashboard/create', icon: FiPlusCircle },
                { name: 'Manage Brands', path: '/dashboard/brands', icon: FiTag },
            ]
        },
        {
            section: 'Management',
            items: [
                { name: 'Orders', path: '/dashboard/orders', icon: FiShoppingCart },
                { name: 'Customers', path: '/dashboard/customers', icon: FiUsers },
                { name: 'Concierge Chat', path: '/dashboard/messages', icon: FiMessageSquare, badge: unreadCount ? unreadCount : null },
                { name: 'Analytics', path: '/dashboard/analytics', icon: FiBarChart2 },
            ]
        },
        {
            section: 'Settings',
            items: [
                { name: 'Settings', path: '/dashboard/settings', icon: FiSettings },
            ]
        }
    ];

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    if (!mounted) return null;

    return (
        <div className='dashboard-page nav-obscure-view'>
            <div className='dashboard-container'>
                {/* Sidebar */}
                <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className='dashboard-sidebar-header'>
                        <Link href='/' className='dashboard-sidebar-logo'>
                            <div className='dashboard-sidebar-logo-icon'>🥃</div>
                            {!sidebarCollapsed && (
                                <span className='dashboard-sidebar-logo-text'>
                                    Liquor<span>Luxx</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    <nav className='dashboard-nav'>
                        {navItems.map((section, idx) => (
                            <div key={idx} className='dashboard-nav-section'>
                                {!sidebarCollapsed && (
                                    <div className='dashboard-nav-label'>{section.section}</div>
                                )}
                                <ul className='dashboard-nav-list'>
                                    {section.items.map((item, itemIdx) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.path;
                                        return (
                                            <li key={itemIdx}>
                                                <Link
                                                    href={item.path}
                                                    className={`dashboard-nav-item ${isActive ? 'active' : ''}`}
                                                    onClick={() => setSidebarOpen(false)}
                                                    title={sidebarCollapsed ? item.name : ''}
                                                >
                                                    <span className='dashboard-nav-icon'><Icon /></span>
                                                    {!sidebarCollapsed && item.name}
                                                    {!sidebarCollapsed && item.badge && (
                                                        <span className='dashboard-nav-badge'>{item.badge}</span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                        {/* User Section */}
                        <div className='dashboard-nav-section' style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
                            {session?.user && (
                                <div style={{
                                    padding: sidebarCollapsed ? '12px 0' : '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                    gap: '12px',
                                    marginBottom: '8px'
                                }}>
                                    <img
                                        src={session.user.image || 'https://via.placeholder.com/40'}
                                        alt={session.user.name}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    {!sidebarCollapsed && (
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                                {session.user.name}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                Admin
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={handleSignOut}
                                className='dashboard-nav-item'
                                style={{ width: '100%' }}
                                title={sidebarCollapsed ? 'Sign Out' : ''}
                            >
                                <span className='dashboard-nav-icon'><FiLogOut /></span>
                                {!sidebarCollapsed && 'Sign Out'}
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Dashboard Header */}
                <header className='dashboard-top-header' style={{
                    marginLeft: sidebarCollapsed ? '80px' : '280px',
                    width: sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)'
                }}>
                    <div className='dashboard-top-header-left'>
                        <button
                            className='dashboard-header-toggle-btn'
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <HiOutlineViewGridAdd />
                        </button>

                        <form onSubmit={handleSearch} className='dashboard-global-search'>
                            <FiSearch className='dashboard-global-search-icon' />
                            <input
                                type='text'
                                placeholder='Search products, orders, customers...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='dashboard-global-search-input'
                            />
                            {searchQuery && (
                                <button
                                    type='button'
                                    onClick={() => setSearchQuery('')}
                                    className='dashboard-global-search-clear'
                                >
                                    <FiX />
                                </button>
                            )}
                        </form>
                    </div>

                    <div className='dashboard-top-header-right'>
                        <div className="notification-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <button
                                className={`dashboard-header-icon-btn ${showNotifications ? 'active' : ''}`}
                                title='Notifications'
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{ color: showNotifications ? '#d4af37' : 'inherit' }}
                            >
                                <FiBell />
                                {unreadCount > 0 && <span className='dashboard-header-badge'>{unreadCount}</span>}
                            </button>

                            {showNotifications && (
                                <>
                                    <div
                                        style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <div className="notification-dropdown" style={{
                                        position: 'absolute',
                                        top: '120%',
                                        right: '0',
                                        width: '320px',
                                        background: '#1e1e1e',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                        zIndex: 1000,
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #333',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#252525'
                                        }}>
                                            <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: '600' }}>Notifications</h4>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '30px 20px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div
                                                        key={notif._id}
                                                        onClick={() => handleMarkAsRead(notif._id, notif.link)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            borderBottom: '1px solid #2a2a2a',
                                                            background: notif.isRead ? 'transparent' : 'rgba(212, 175, 55, 0.08)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            gap: '12px'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.isRead ? 'transparent' : 'rgba(212, 175, 55, 0.08)'}
                                                    >
                                                        <div style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: notif.isRead ? 'transparent' : '#d4af37',
                                                            marginTop: '6px',
                                                            flexShrink: 0
                                                        }} />
                                                        <div>
                                                            <div style={{ fontSize: '13px', fontWeight: notif.isRead ? '500' : '700', color: notif.isRead ? '#ddd' : '#fff', marginBottom: '4px' }}>
                                                                {notif.title}
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', lineHeight: '1.4' }}>
                                                                {notif.message}
                                                            </div>
                                                            <div style={{ fontSize: '10px', color: '#666' }}>
                                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {session?.user && (
                            <div className='dashboard-header-user'>
                                <img
                                    src={session.user.image || 'https://via.placeholder.com/40'}
                                    alt={session.user.name}
                                    className='dashboard-header-user-avatar'
                                />
                                <div className='dashboard-header-user-info'>
                                    <div className='dashboard-header-user-name'>{session.user.name}</div>
                                    <div className='dashboard-header-user-role'>Admin</div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className='dashboard-main' style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}>
                    {children}
                </main>

                {/* Mobile Toggle */}
                <button
                    className='dashboard-mobile-toggle'
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 40
                        }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
