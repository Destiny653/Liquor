'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import {
    FiPackage, FiDollarSign, FiShoppingCart, FiTrendingUp,
    FiSearch, FiEdit2, FiTrash2, FiStar, FiEye, FiPlus
} from 'react-icons/fi';
import { Notyf } from 'notyf';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchQuery(query);
            setCurrentPage(1); // Reset to first page on search
        }
    }, [searchParams]);

    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const result = await fetch('/api/products?limit=100'); // Fetch enough for current client pagination
            if (result.ok) {
                const data = await result.json();
                const products = data.products || data; // Handle both old and new response formats
                setPosts(products);
                if (products.length > 0) setSelectedPost(products[0]);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };


    const deletePost = async (id) => {
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                notyf.success('Product deleted successfully');
                setPosts(posts.filter(p => p._id !== id));
                if (selectedPost?._id === id) {
                    setSelectedPost(posts.find(p => p._id !== id) || null);
                }
            } else {
                notyf.error('Failed to delete product');
            }
        } catch (error) {
            notyf.error('Error deleting product');
        } finally {
            setDeleting(false);
        }
    };


    const filteredPosts = posts.filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate stats
    const totalProducts = posts.length;
    const totalValue = posts.reduce((sum, p) => sum + (p.price || 0), 0);
    const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    return (
        <DashboardLayout>
            {/* Loading */}
            {loading && (
                <div className='dashboard-loader'>
                    <div className='dashboard-spinner'></div>
                </div>
            )}

            {/* Header */}
            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Product Management</h1>
                    <p>Manage your premium spirits collection</p>
                </div>
                <div className='dashboard-header-right'>
                    <Link href='/dashboard/create' className='dashboard-header-btn'>
                        <FiPlus />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className='dashboard-stats'>
                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon'>
                            <FiPackage />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} />
                            +12%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>{totalProducts}</h3>
                    <p className='dashboard-stat-label'>Total Products</p>
                </div>

                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon accent'>
                            <FiDollarSign />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} />
                            +8%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>{formatter.format(totalValue)}</h3>
                    <p className='dashboard-stat-label'>Inventory Value</p>
                </div>

                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon green'>
                            <FiShoppingCart />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} />
                            +24%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>156</h3>
                    <p className='dashboard-stat-label'>Total Orders</p>
                </div>

                <div className='dashboard-stat-card'>
                    <div className='dashboard-stat-header'>
                        <div className='dashboard-stat-icon blue'>
                            <FiDollarSign />
                        </div>
                        <span className='dashboard-stat-change positive'>
                            <FiTrendingUp size={12} />
                            +5%
                        </span>
                    </div>
                    <h3 className='dashboard-stat-value'>{formatter.format(avgPrice)}</h3>
                    <p className='dashboard-stat-label'>Avg. Product Price</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className='dashboard-grid-side-preview'>
                {/* Products Table */}
                <div className='dashboard-card'>
                    <div className='dashboard-card-header'>
                        <h3 className='dashboard-card-title'>All Products</h3>
                        <div className='dashboard-card-actions'>
                            <div className='dashboard-search'>
                                <FiSearch className='dashboard-search-icon' />
                                <input
                                    type='text'
                                    placeholder='Search products...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <>
                            <table className='dashboard-table'>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Rating</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((post, index) => (
                                        <tr
                                            key={post._id || index}
                                            onClick={() => setSelectedPost(post)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td data-label="Product">
                                                <div className='dashboard-product-cell'>
                                                    <img
                                                        src={post.img}
                                                        alt={post.title}
                                                        className='dashboard-product-image'
                                                    />
                                                    <div className='dashboard-product-info'>
                                                        <h4>{post.title?.slice(0, 30)}{post.title?.length > 30 ? '...' : ''}</h4>
                                                        <p>{post.productModel || 'Premium Whiskey'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Price">
                                                <span className='dashboard-price'>
                                                    {formatter.format(post.price)}
                                                </span>
                                            </td>
                                            <td data-label="Rating">
                                                <div className='dashboard-rating'>
                                                    <FiStar fill='currentColor' size={14} />
                                                    {post.rating || 4.5}
                                                </div>
                                            </td>
                                            <td data-label="Status">
                                                <span className='dashboard-status active'>
                                                    <span className='dashboard-status-dot'></span>
                                                    In Stock
                                                </span>
                                            </td>
                                            <td data-label="Actions">
                                                <div className='dashboard-actions'>
                                                    <button
                                                        className='dashboard-action-btn'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedPost(post);
                                                        }}
                                                    >
                                                        <FiEye />
                                                    </button>
                                                    <Link
                                                        href={`/dashboard/update/${post.productModel?.toLowerCase()}/${post._id}`}
                                                        className='dashboard-action-btn edit'
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <FiEdit2 />
                                                    </Link>
                                                    <button
                                                        className='dashboard-action-btn delete'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deletePost(post._id);
                                                        }}

                                                        disabled={deleting}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className='dashboard-pagination'>
                                <span className='dashboard-pagination-info'>
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPosts.length)} of {filteredPosts.length} products
                                </span>
                                <div className='dashboard-pagination-buttons'>
                                    <button
                                        className='dashboard-pagination-btn'
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
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
                        </>
                    ) : (
                        <div className='dashboard-empty'>
                            <div className='dashboard-empty-icon'>
                                <FiPackage />
                            </div>
                            <h3>No Products Found</h3>
                            <p>Add your first product to get started</p>
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                {selectedPost && (
                    <div className='dashboard-preview'>
                        <h3 className='dashboard-preview-header'>Product Preview</h3>
                        <img
                            src={selectedPost.img}
                            alt={selectedPost.title}
                            className='dashboard-preview-image'
                        />
                        <h4 className='dashboard-preview-title'>{selectedPost.title}</h4>
                        <p className='dashboard-preview-price'>{formatter.format(selectedPost.price)}</p>
                        <p className='dashboard-preview-desc'>
                            {selectedPost.content?.slice(0, 150)}
                            {selectedPost.content?.length > 150 ? '...' : ''}
                        </p>

                        <div className='dashboard-preview-actions'>
                            <Link
                                href={`/dashboard/update/${selectedPost.productModel?.toLowerCase()}/${selectedPost._id}`}
                                className='dashboard-preview-btn primary'
                            >
                                <FiEdit2 size={16} />
                                Edit
                            </Link>
                            <button
                                className='dashboard-preview-btn danger'
                                onClick={() => deletePost(selectedPost._id)}
                                disabled={deleting}
                            >
                                <FiTrash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout >
    );
}
