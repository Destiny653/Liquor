'use client';
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiUsers, FiActivity } from 'react-icons/fi';

export default function AnalyticsPage() {
    // Mock data and components for chart placeholders
    return (
        <DashboardLayout>
            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Analytics</h1>
                    <p>Overview of store performance</p>
                </div>
                <div className='dashboard-header-right'>
                    <select style={{
                        padding: '10px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px',
                        color: 'var(--color-text-primary)',
                        outline: 'none'
                    }}>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            <div className='dashboard-stats' style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon accent'>
                            <FiDollarSign />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} /> +12.5%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>$24,300</h3>
                    <p className='dashboard-stat-label'>Total Revenue</p>
                </div>

                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon green'>
                            <FiShoppingBag />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} /> +8.2%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>1,245</h3>
                    <p className='dashboard-stat-label'>Total Sales</p>
                </div>

                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon blue'>
                            <FiUsers />
                        </div>
                        <span className='dashboard-stat-change negative'>
                            <FiTrendingDown size={12} /> -2.1%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>892</h3>
                    <p className='dashboard-stat-label'>New Customers</p>
                </div>

                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon'>
                            <FiActivity />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} /> +5.4%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>$128</h3>
                    <p className='dashboard-stat-label'>Avg. Order Value</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
                <div className='dashboard-card' style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>Revenue Overview (Chart Placeholder)</h3>
                    <div style={{ width: '80%', height: 2, background: 'var(--color-border)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -50, left: '20%', height: 50, width: 40, background: 'var(--color-gold)', opacity: 0.5 }}></div>
                        <div style={{ position: 'absolute', top: -80, left: '40%', height: 80, width: 40, background: 'var(--color-gold)', opacity: 0.7 }}></div>
                        <div style={{ position: 'absolute', top: -60, left: '60%', height: 60, width: 40, background: 'var(--color-gold)', opacity: 0.6 }}></div>
                        <div style={{ position: 'absolute', top: -90, left: '80%', height: 90, width: 40, background: 'var(--color-gold)', opacity: 0.8 }}></div>
                    </div>
                </div>
                <div className='dashboard-card' style={{ height: 400, padding: 24 }}>
                    <h3 className='dashboard-card-title' style={{ marginBottom: 20 }}>Top Products</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                            { name: 'Pappy Van Winkle 23', sales: 45, percent: 80 },
                            { name: 'Macallan 18 Year', sales: 38, percent: 65 },
                            { name: 'Hibiki Harmony', sales: 32, percent: 50 },
                            { name: 'Weller 12 Year', sales: 28, percent: 40 },
                            { name: 'Blanton\'s Original', sales: 25, percent: 35 },
                        ].map((item, i) => (
                            <li key={i} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                                    <span style={{ color: 'var(--color-text-primary)' }}>{item.name}</span>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{item.sales} sold</span>
                                </div>
                                <div style={{ width: '100%', height: 6, background: 'var(--color-border)', borderRadius: 3 }}>
                                    <div style={{ width: `${item.percent}%`, height: '100%', background: 'var(--color-gold)', borderRadius: 3 }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
