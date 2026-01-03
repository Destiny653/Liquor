'use client';
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiSearch, FiEye, FiFilter, FiDownload, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock data for orders
    const orders = [
        { id: '#ORD-7829', customer: 'James Wilson', date: 'Oct 24, 2025', amount: 549.99, status: 'completed', items: 3 },
        { id: '#ORD-7830', customer: 'Elena Rodriguez', date: 'Oct 24, 2025', amount: 1299.00, status: 'processing', items: 1 },
        { id: '#ORD-7831', customer: 'Michael Chen', date: 'Oct 23, 2025', amount: 249.50, status: 'completed', items: 2 },
        { id: '#ORD-7832', customer: 'Sarah Johnson', date: 'Oct 23, 2025', amount: 89.99, status: 'cancelled', items: 1 },
        { id: '#ORD-7833', customer: 'David Smith', date: 'Oct 22, 2025', amount: 4500.00, status: 'processing', items: 5 },
        { id: '#ORD-7834', customer: 'Emily Davis', date: 'Oct 22, 2025', amount: 299.99, status: 'completed', items: 1 },
        { id: '#ORD-7835', customer: 'Robert Brown', date: 'Oct 21, 2025', amount: 159.95, status: 'completed', items: 2 },
        { id: '#ORD-7836', customer: 'Jennifer Lee', date: 'Oct 21, 2025', amount: 799.00, status: 'completed', items: 1 },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'dashboard-status active';
            case 'processing': return 'dashboard-status warning'; // Need to add warning class or inline style
            case 'cancelled': return 'dashboard-status inactive';
            default: return 'dashboard-status';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FiCheckCircle size={14} />;
            case 'processing': return <FiClock size={14} />;
            case 'cancelled': return <FiXCircle size={14} />;
            default: return null;
        }
    };

    return (
        <DashboardLayout>
            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Orders</h1>
                    <p>Manage and track customer orders</p>
                </div>
                <div className='dashboard-header-right'>
                    <button className='dashboard-header-btn dashboard-header-btn-secondary'>
                        <FiDownload />
                        Export
                    </button>
                </div>
            </div>

            <div className='dashboard-card'>
                <div className='dashboard-card-header'>
                    <h3 className='dashboard-card-title'>Recent Orders</h3>
                    <div className='dashboard-card-actions'>
                        <div className='dashboard-search'>
                            <FiSearch className='dashboard-search-icon' />
                            <input
                                type='text'
                                placeholder='Search orders...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className='dashboard-action-btn'>
                            <FiFilter />
                        </button>
                    </div>
                </div>

                <table className='dashboard-table'>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{order.id}</td>
                                <td>{order.customer}</td>
                                <td style={{ color: 'var(--color-text-muted)' }}>{order.date}</td>
                                <td>{order.items} items</td>
                                <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                    ${order.amount.toFixed(2)}
                                </td>
                                <td>
                                    <span
                                        className={getStatusColor(order.status)}
                                        style={order.status === 'processing' ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' } : {}}
                                    >
                                        {getStatusIcon(order.status)}
                                        <span style={{ marginLeft: 6, textTransform: 'capitalize' }}>{order.status}</span>
                                    </span>
                                </td>
                                <td>
                                    <div className='dashboard-actions'>
                                        <button className='dashboard-action-btn' title="View Details">
                                            <FiEye />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination (Static for mock) */}
                <div className='dashboard-pagination'>
                    <span className='dashboard-pagination-info'>Showing 1 to 8 of 8 orders</span>
                    <div className='dashboard-pagination-buttons'>
                        <button className='dashboard-pagination-btn' disabled>Previous</button>
                        <button className='dashboard-pagination-btn active'>1</button>
                        <button className='dashboard-pagination-btn' disabled>Next</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
