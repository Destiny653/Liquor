'use client';
import React, { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiSearch, FiEye, FiFilter, FiDownload, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { Notyf } from 'notyf';

function OrdersContent() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
        const flatOrders = [];

        apiOrders.forEach(orderDoc => {
            const user = orderDoc.user || { name: 'Unknown User', email: 'N/A' };

            if (orderDoc.orders && Array.isArray(orderDoc.orders)) {
                orderDoc.orders.forEach((orderItem, index) => {
                    const orderId = orderItem._id || `${orderDoc._id.slice(-6)}-${index + 1}`;

                    const totalItems = orderItem.products ?
                        orderItem.products.reduce((acc, curr) => acc + (curr.quantity || 1), 0) : 0;

                    const date = orderItem.orderDate || orderDoc.createdAt;

                    flatOrders.push({
                        id: orderId,
                        rawId: orderDoc._id,
                        customer: user.name,
                        email: user.email,
                        phone: user.phoneNumber || orderItem.billingDetails?.phone || 'N/A',
                        date: new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                        }),
                        amount: orderItem.totalPrice,
                        items: totalItems,
                        status: orderItem.status || 'Pending',
                        payment: orderItem.paymentMethod || 'N/A',
                        billing: orderItem.billingDetails,
                        products: orderItem.products
                    });
                });
            }
        });

        setOrders(flatOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedOrder(null), 300);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'completed': return 'dashboard-status active';
            case 'pending':
            case 'processing': return 'dashboard-status warning';
            case 'cancelled': return 'dashboard-status inactive';
            default: return 'dashboard-status';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'completed': return <FiCheckCircle size={14} />;
            case 'pending':
            case 'processing': return <FiClock size={14} />;
            case 'cancelled': return <FiXCircle size={14} />;
            default: return <FiAlertCircle size={14} />;
        }
    };

    const filteredOrders = orders.filter(order =>
        order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
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
                        Export Data
                    </button>
                </div>
            </div>

            <div className='dashboard-card'>
                <div className='dashboard-card-header'>
                    <h3 className='dashboard-card-title'>Recent Transactions</h3>
                    <div className='dashboard-card-actions'>
                        <div className='dashboard-search'>
                            <FiSearch className='dashboard-search-icon' />
                            <input
                                type='text'
                                placeholder='Search customer or ID...'
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
                                <th>Payment</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((order, index) => (
                                    <tr key={index}>
                                        <td data-label="Order ID">
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                                #{order.id?.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td data-label="Customer">
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{order.customer}</span>
                                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{order.email}</span>
                                            </div>
                                        </td>
                                        <td data-label="Date" style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{order.date}</td>
                                        <td data-label="Payment">
                                            <span style={{ fontSize: '11px', fontWeight: '800', opacity: 0.7 }}>
                                                {order.payment?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td data-label="Total" style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                            {formatter.format(order.amount)}
                                        </td>
                                        <td data-label="Status">
                                            <span
                                                className={getStatusColor(order.status)}
                                                style={order.status?.toLowerCase() === 'pending' ? { background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' } : {}}
                                            >
                                                {getStatusIcon(order.status)}
                                                <span style={{ marginLeft: 6, textTransform: 'capitalize' }}>{order.status}</span>
                                            </span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className='dashboard-actions'>
                                                <button
                                                    className='dashboard-action-btn'
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                    <FiEye />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
                                        No matching orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredOrders.length > itemsPerPage && (
                    <div className='dashboard-pagination'>
                        <span className='dashboard-pagination-info'>
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}
                        </span>
                        <div className='dashboard-pagination-buttons'>
                            <button
                                className='dashboard-pagination-btn'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`dashboard-pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                    onClick={() => paginate(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
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

            {/* Order Details Sliding Drawer */}
            <div
                className={`order-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
                onClick={closeDrawer}
            />
            <div className={`order-drawer ${isDrawerOpen ? 'open' : ''}`}>
                <div className='order-drawer-header'>
                    <h2>Order Details</h2>
                    <button className='order-drawer-close' onClick={closeDrawer}>
                        <FiXCircle />
                    </button>
                </div>

                {selectedOrder && (
                    <div className='order-drawer-body'>
                        {/* Status Summary */}
                        <div className='order-detail-section' style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '8px' }}>
                                <span className={getStatusColor(selectedOrder.status)} style={{ padding: '8px 20px', borderRadius: '50px' }}>
                                    {getStatusIcon(selectedOrder.status)}
                                    <span style={{ marginLeft: 8, fontWeight: 700 }}>{selectedOrder.status.toUpperCase()}</span>
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Order ID: #{selectedOrder.id?.toUpperCase()}</p>
                        </div>

                        {/* Customer & Billing */}
                        <div className='order-detail-section'>
                            <span className='order-detail-label'>Customer Information</span>
                            <div className='order-info-card'>
                                <div className='order-info-row'>
                                    <span>Name</span>
                                    <span className='order-info-value'>{selectedOrder.customer}</span>
                                </div>
                                <div className='order-info-row'>
                                    <span>Email</span>
                                    <span className='order-info-value'>{selectedOrder.email}</span>
                                </div>
                                <div className='order-info-row'>
                                    <span>Phone</span>
                                    <span className='order-info-value'>{selectedOrder.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className='order-detail-section'>
                            <span className='order-detail-label'>Shipping / Billing Address</span>
                            <div className='order-info-card' style={{ borderStyle: 'dashed' }}>
                                {selectedOrder.billing ? (
                                    <>
                                        <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: '4px' }}>
                                            {selectedOrder.billing.firstname} {selectedOrder.billing.lastname}
                                        </div>
                                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                                            {selectedOrder.billing.streetAddress}<br />
                                            {selectedOrder.billing.city}, {selectedOrder.billing.state} {selectedOrder.billing.zipCode}<br />
                                            {selectedOrder.billing.country}
                                        </div>
                                        {selectedOrder.billing.additionalNotes && (
                                            <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '6px', fontSize: '12px', color: 'var(--color-gold)' }}>
                                                <strong>Notes:</strong> {selectedOrder.billing.additionalNotes}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No billing details provided.</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className='order-detail-section'>
                            <span className='order-detail-label'>Payment Details</span>
                            <div className='order-info-card'>
                                <div className='order-info-row'>
                                    <span>Method</span>
                                    <span className='order-info-value' style={{ color: 'var(--color-gold)' }}>
                                        {selectedOrder.payment?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className='order-info-row'>
                                    <span>Transaction Date</span>
                                    <span className='order-info-value'>{selectedOrder.date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className='order-detail-section'>
                            <span className='order-detail-label'>Order Items ({selectedOrder.products?.length || 0})</span>
                            <div className='order-products-list'>
                                {selectedOrder.products?.map((prod, idx) => (
                                    <div key={idx} className='order-product-item'>
                                        <img
                                            src={prod.productId?.img || 'https://via.placeholder.com/60'}
                                            alt=""
                                            className='order-product-img'
                                        />
                                        <div className='order-product-details'>
                                            <h4 className='order-product-title'>{prod.productId?.title || 'Unknown Product'}</h4>
                                            <div className='order-product-meta'>
                                                Qty: {prod.quantity} &times; {formatter.format(prod.price)}
                                            </div>
                                        </div>
                                        <div className='order-product-price'>
                                            {formatter.format(prod.price * prod.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className='order-drawer-footer'>
                    <div className='order-total-display'>
                        <span className='order-total-label'>Grand Total</span>
                        <span className='order-total-value'>{selectedOrder ? formatter.format(selectedOrder.amount) : '$0.00'}</span>
                    </div>
                    <div className='order-action-btns'>
                        <button className='order-btn-approve'>Complete Order</button>
                        <button className='order-btn-cancel'>Cancel Order</button>
                    </div>
                </div>
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
