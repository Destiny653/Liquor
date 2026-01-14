'use client';
import React, { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiSearch, FiEye, FiFilter, FiDownload, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { Notyf } from 'notyf';

function OrdersContent() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.order) {
                    processOrders(data.order);
                }
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const processOrders = (apiOrders) => {
        // Flatten the nested order structure
        // User -> Orders Array -> Products Array (which essentially is one "cart" checkout usually)
        // But looking at the schema, 'orders' array in User model seems to store history.
        // The /api/orders GET returns Order documents.
        // Order Schema: user (ref), orders: [{ products: [...], totalPrice }]

        const flatOrders = [];

        apiOrders.forEach(orderDoc => {
            const user = orderDoc.user || { name: 'Unknown User', email: 'N/A' };

            if (orderDoc.orders && Array.isArray(orderDoc.orders)) {
                orderDoc.orders.forEach((orderItem, index) => {
                    // Create a unique ID for this specific order instance
                    const orderId = `${orderDoc._id.slice(-6)}-${index + 1}`;

                    // Calculate total items
                    const totalItems = orderItem.products ?
                        orderItem.products.reduce((acc, curr) => acc + (curr.quantity || 1), 0) : 0;

                    // Determine logic for status - simulating based on data existence or random for demo if not in DB
                    // Since schema doesn't seem to have 'status' in the nested object, we'll assume 'completed' for now
                    // or check if it's recent. 
                    const status = 'completed';

                    // Format Date
                    const date = orderDoc.createdAt ? new Date(orderDoc.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    }) : 'N/A';

                    flatOrders.push({
                        uniqueId: orderId,
                        customer: user.name,
                        email: user.email,
                        date: date,
                        amount: orderItem.totalPrice,
                        items: totalItems,
                        status: status,
                        products: orderItem.products // Keep for details view if needed
                    });
                });
            }
        });

        // Sort by date (newest first) - assuming we essentially want that
        // Since we don't have exact date for nested items, we rely on parent doc or just reverse
        setOrders(flatOrders.reverse());
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'dashboard-status active';
            case 'processing': return 'dashboard-status warning';
            case 'cancelled': return 'dashboard-status inactive';
            default: return 'dashboard-status';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FiCheckCircle size={14} />;
            case 'processing': return <FiClock size={14} />;
            case 'cancelled': return <FiXCircle size={14} />;
            default: return <FiAlertCircle size={14} />;
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.uniqueId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
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
                    <h3 className='dashboard-card-title'>All Orders</h3>
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
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
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
                            {currentItems.length > 0 ? (
                                currentItems.map((order, index) => (
                                    <tr key={index}>
                                        <td data-label="Order ID" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>#{order.uniqueId}</td>
                                        <td data-label="Customer">
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>{order.customer}</span>
                                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{order.email}</span>
                                            </div>
                                        </td>
                                        <td data-label="Date" style={{ color: 'var(--color-text-muted)' }}>{order.date}</td>
                                        <td data-label="Items">{order.items} items</td>
                                        <td data-label="Amount" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                                            {formatter.format(order.amount)}
                                        </td>
                                        <td data-label="Status">
                                            <span
                                                className={getStatusColor(order.status)}
                                                style={order.status === 'processing' ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' } : {}}
                                            >
                                                {getStatusIcon(order.status)}
                                                <span style={{ marginLeft: 6, textTransform: 'capitalize' }}>{order.status}</span>
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className='dashboard-actions'>
                                                <button className='dashboard-action-btn' title="View Details">
                                                    <FiEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredOrders.length > 0 && (
                    <div className='dashboard-pagination'>
                        <span className='dashboard-pagination-info'>
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
                        </span>
                        <div className='dashboard-pagination-buttons'>
                            <button
                                className='dashboard-pagination-btn'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                // Simple pagination logic for now (showing first 5 or logic needs to be smarter for many pages)
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    // shift window
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) return null;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        className={`dashboard-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                        onClick={() => paginate(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }).filter(Boolean)}

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

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className='dashboard-loader'>
                <div className='dashboard-spinner'></div>
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
