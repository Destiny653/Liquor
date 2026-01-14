'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiTag, FiImage, FiExternalLink
} from 'react-icons/fi';
import { Notyf } from 'notyf';

export default function BrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newBrand, setNewBrand] = useState({ value: '', label: '', description: '', image: '' });
    const [editingBrand, setEditingBrand] = useState(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/product-models');
            if (res.ok) {
                const data = await res.json();
                setBrands(data);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
        try {
            const res = await fetch('/api/product-models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBrand)
            });
            if (res.ok) {
                notyf.success('Brand added successfully');
                setNewBrand({ value: '', label: '', description: '', image: '' });
                setIsAdding(false);
                fetchBrands();
            } else {
                notyf.error('Failed to add brand');
            }
        } catch (error) {
            notyf.error('Error adding brand');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
        try {
            const res = await fetch(`/api/product-models/${editingBrand._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBrand)
            });
            if (res.ok) {
                notyf.success('Brand updated successfully');
                setEditingBrand(null);
                fetchBrands();
            } else {
                notyf.error('Failed to update brand');
            }
        } catch (error) {
            notyf.error('Error updating brand');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this brand? Products associated with it will still exist but might not show up in filtered views.')) return;
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
        try {
            const res = await fetch(`/api/product-models/${id}`, { method: 'DELETE' });
            if (res.ok) {
                notyf.success('Brand deleted successfully');
                fetchBrands();
            } else {
                notyf.error('Failed to delete brand');
            }
        } catch (error) {
            notyf.error('Error deleting brand');
        }
    };

    return (
        <DashboardLayout>
            {/* Loading */}
            {loading && (
                <div className='dashboard-loader'>
                    <div className='dashboard-spinner'></div>
                </div>
            )}

            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Brand Management</h1>
                    <p>Manage product categories and brands</p>
                </div>
                <div className='dashboard-header-right'>
                    <button onClick={() => { setIsAdding(!isAdding); setEditingBrand(null); }} className='dashboard-header-btn'>
                        {isAdding ? <FiX /> : <FiPlus />}
                        {isAdding ? 'Cancel' : 'Add Brand'}
                    </button>
                </div>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingBrand) && (
                <div className='dashboard-card' style={{ marginBottom: '24px' }}>
                    <div className='dashboard-card-header'>
                        <h3 className='dashboard-card-title'>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
                        {editingBrand && (
                            <button onClick={() => setEditingBrand(null)} className='dashboard-action-btn'>
                                <FiX />
                            </button>
                        )}
                    </div>
                    <form onSubmit={editingBrand ? handleUpdate : handleAdd} style={{ padding: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Value (ID used in URLs)</label>
                                <input
                                    type='text'
                                    placeholder='e.g. blantons'
                                    value={editingBrand ? editingBrand.value : newBrand.value}
                                    onChange={(e) => {
                                        const val = e.target.value.toLowerCase().trim();
                                        if (editingBrand) setEditingBrand({ ...editingBrand, value: val });
                                        else setNewBrand({ ...newBrand, value: val });
                                    }}
                                    required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Label (Display Name)</label>
                                <input
                                    type='text'
                                    placeholder='e.g. Blanton'
                                    value={editingBrand ? editingBrand.label : newBrand.label}
                                    onChange={(e) => {
                                        if (editingBrand) setEditingBrand({ ...editingBrand, label: e.target.value });
                                        else setNewBrand({ ...newBrand, label: e.target.value });
                                    }}
                                    required
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Image URL</label>
                                <input
                                    type='text'
                                    placeholder='URL to brand image'
                                    value={editingBrand ? editingBrand.image : newBrand.image}
                                    onChange={(e) => {
                                        if (editingBrand) setEditingBrand({ ...editingBrand, image: e.target.value });
                                        else setNewBrand({ ...newBrand, image: e.target.value });
                                    }}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Description</label>
                                <input
                                    type='text'
                                    placeholder='Short description'
                                    value={editingBrand ? editingBrand.description : newBrand.description}
                                    onChange={(e) => {
                                        if (editingBrand) setEditingBrand({ ...editingBrand, description: e.target.value });
                                        else setNewBrand({ ...newBrand, description: e.target.value });
                                    }}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white' }}
                                />
                            </div>
                        </div>

                        {(editingBrand?.image || newBrand.image) && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '8px' }}>Image Preview</p>
                                <img
                                    src={editingBrand ? editingBrand.image : newBrand.image}
                                    alt="Preview"
                                    style={{ height: '80px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                                    onError={(e) => e.target.src = 'https://placehold.co/200x200?text=Invalid+URL'}
                                />
                            </div>
                        )}

                        <button type='submit' className='dashboard-header-btn' style={{ width: '100%' }}>
                            {editingBrand ? 'Update Brand' : 'Add Brand'}
                        </button>
                    </form>
                </div>
            )}

            <div className='dashboard-card'>
                <div className='dashboard-card-header'>
                    <h3 className='dashboard-card-title'>Active Brands</h3>
                </div>
                <div className='dashboard-table-container'>
                    <table className='dashboard-table'>
                        <thead>
                            <tr>
                                <th>Thumbnail</th>
                                <th>Label</th>
                                <th>Value</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand) => (
                                <tr key={brand._id}>
                                    <td>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                            <img
                                                src={brand.image || 'https://placehold.co/40x40?text=No+Img'}
                                                alt={brand.label}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </td>
                                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiTag /> {brand.label}</div></td>
                                    <td><code>{brand.value}</code></td>
                                    <td><div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brand.description || '-'}</div></td>
                                    <td>
                                        <div className='dashboard-actions'>
                                            <button
                                                className='dashboard-action-btn edit'
                                                onClick={() => { setEditingBrand(brand); setIsAdding(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className='dashboard-action-btn delete'
                                                onClick={() => handleDelete(brand._id)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .dashboard-table-container {
                    overflow-x: auto;
                }
                .dashboard-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .dashboard-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(212, 175, 55, 0.1);
                    border-top: 3px solid var(--color-gold);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </DashboardLayout>
    );
}
