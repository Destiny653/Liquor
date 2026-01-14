'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome, FiPackage, FiPlusCircle, FiSettings,
    FiUsers, FiShoppingCart, FiBarChart2, FiLogOut,
    FiMenu, FiX, FiMessageSquare, FiTag, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import '../dashboard.css';

export default function DashboardLayout({ children }) {
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        {
            section: 'Main',
            items: [
                { name: 'Dashboard', path: '/dashboard/posts', icon: FiHome },
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
                { name: 'Concierge Chat', path: '/dashboard/messages', icon: FiMessageSquare },
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
                        <button
                            className='dashboard-sidebar-toggle'
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                        </button>
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
