'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiSearch, FiMail, FiMapPin, FiMoreHorizontal, FiUser } from 'react-icons/fi';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setCustomers(data.users);
                }
            } else {
                console.error('Failed to fetch customers');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <DashboardLayout>
            {loading && (
                <div className='dashboard-loader'>
                    <div className='dashboard-spinner'></div>
                </div>
            )}

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

                <div style={{ overflowX: 'auto' }}>
                    <table className='dashboard-table'>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Est. Orders</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((customer) => (
                                    <tr key={customer._id}>
                                        <td data-label="Customer">
                                            <div className='dashboard-product-cell'>
                                                {customer.image ? (
                                                    <img
                                                        src={customer.image}
                                                        alt={customer.name}
                                                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: 40, height: 40, borderRadius: '50%',
                                                        border: '1px solid var(--color-border)',
                                                        background: 'var(--color-bg-secondary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: 'var(--color-text-secondary)'
                                                    }}>
                                                        <FiUser />
                                                    </div>
                                                )}

                                                <div className='dashboard-product-info'>
                                                    <h4>{customer.name}</h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Email" style={{ color: 'var(--color-text-secondary)' }}>{customer.email}</td>
                                        <td data-label="Role" style={{ color: 'var(--color-text-muted)' }}>
                                            <span style={{
                                                textTransform: 'capitalize',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: customer.role === 'admin' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                                color: customer.role === 'admin' ? 'var(--color-gold)' : 'inherit'
                                            }}>
                                                {customer.role || 'user'}
                                            </span>
                                        </td>
                                        <td data-label="Joined" style={{ color: 'var(--color-text-muted)' }}>
                                            {new Date(customer.createdAt).toLocaleDateString()}
                                        </td>
                                        <td data-label="Est. Orders" style={{ fontWeight: 500 }}>
                                            {customer.orders ? customer.orders.length : 0}
                                        </td>
                                        <td data-label="Actions">
                                            <button className='dashboard-action-btn'>
                                                <FiMoreHorizontal />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                                        No customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredCustomers.length > 0 && (
                    <div className='dashboard-pagination'>
                        <span className='dashboard-pagination-info'>
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
                        </span>
                        <div className='dashboard-pagination-buttons'>
                            <button
                                className='dashboard-pagination-btn'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button className='dashboard-pagination-btn active'>{currentPage}</button>
                            <button
                                className='dashboard-pagination-btn'
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
