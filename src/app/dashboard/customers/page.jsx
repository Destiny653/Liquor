'use client';
import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiSearch, FiMail, FiMapPin, FiMoreHorizontal } from 'react-icons/fi';

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const customers = [
        {
            id: 1,
            name: 'James Wilson',
            email: 'james.wilson@example.com',
            location: 'New York, USA',
            orders: 12,
            spent: 4500.00,
            avatar: 'https://i.pravatar.cc/150?img=11'
        },
        {
            id: 2,
            name: 'Elena Rodriguez',
            email: 'elena.r@example.com',
            location: 'Madrid, Spain',
            orders: 5,
            spent: 1299.00,
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        {
            id: 3,
            name: 'Michael Chen',
            email: 'm.chen@example.com',
            location: 'San Francisco, USA',
            orders: 3,
            spent: 850.50,
            avatar: 'https://i.pravatar.cc/150?img=3'
        },
        {
            id: 4,
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            location: 'London, UK',
            orders: 8,
            spent: 2100.00,
            avatar: 'https://i.pravatar.cc/150?img=9'
        },
        {
            id: 5,
            name: 'David Smith',
            email: 'd.smith@example.com',
            location: 'Toronto, Canada',
            orders: 1,
            spent: 150.00,
            avatar: 'https://i.pravatar.cc/150?img=12'
        },
    ];

    return (
        <DashboardLayout>
            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Customers</h1>
                    <p>View and manage customer details</p>
                </div>
                <div className='dashboard-header-right'>
                    <button className='dashboard-header-btn'>
                        <FiMail style={{ marginRight: 8 }} />
                        Email List
                    </button>
                </div>
            </div>

            <div className='dashboard-card'>
                <div className='dashboard-card-header'>
                    <h3 className='dashboard-card-title'>All Customers</h3>
                    <div className='dashboard-card-actions'>
                        <div className='dashboard-search'>
                            <FiSearch className='dashboard-search-icon' />
                            <input
                                type='text'
                                placeholder='Search customers...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <table className='dashboard-table'>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div className='dashboard-product-cell'>
                                        <img
                                            src={customer.avatar}
                                            alt={customer.name}
                                            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                                        />
                                        <div className='dashboard-product-info'>
                                            <h4>{customer.name}</h4>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--color-text-secondary)' }}>{customer.email}</td>
                                <td style={{ color: 'var(--color-text-muted)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <FiMapPin size={12} />
                                        {customer.location}
                                    </div>
                                </td>
                                <td style={{ fontWeight: 500 }}>{customer.orders}</td>
                                <td style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                                    ${customer.spent.toFixed(2)}
                                </td>
                                <td>
                                    <button className='dashboard-action-btn'>
                                        <FiMoreHorizontal />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='dashboard-pagination'>
                    <span className='dashboard-pagination-info'>Showing 5 of 142 customers</span>
                    <div className='dashboard-pagination-buttons'>
                        <button className='dashboard-pagination-btn' disabled>Previous</button>
                        <button className='dashboard-pagination-btn active'>1</button>
                        <button className='dashboard-pagination-btn'>2</button>
                        <button className='dashboard-pagination-btn'>3</button>
                        <button className='dashboard-pagination-btn'>Next</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
