'use client';
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
    FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiTag, FiImage, FiUpload, FiCloud
} from 'react-icons/fi';
import { Notyf } from 'notyf';

export default function BrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [formData, setFormData] = useState({ value: '', label: '', description: '', image: '' });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchBrands();

        // Listen for brand updates from other components
        const handleBrandUpdate = () => {
            fetchBrands();
        };

        window.addEventListener('brandDataUpdated', handleBrandUpdate);

        return () => {
            window.removeEventListener('brandDataUpdated', handleBrandUpdate);
        };
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

    const notifyBrandUpdate = () => {
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('brandDataUpdated'));
    };

    const handleOpenDrawer = (brand = null) => {
        if (brand) {
            setEditingBrand(brand);
            setFormData({
                value: brand.value,
                label: brand.label,
                description: brand.description || '',
                image: brand.image || ''
            });
        } else {
            setEditingBrand(null);
            setFormData({ value: '', label: '', description: '', image: '' });
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setEditingBrand(null);
        setFormData({ value: '', label: '', description: '', image: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
        setIsSaving(true);

        const url = editingBrand
            ? `/api/product-models/${editingBrand._id}`
            : '/api/product-models';
        const method = editingBrand ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const savedBrand = await res.json();

                // Optimistically update the UI immediately
                if (editingBrand) {
                    setBrands(brands.map(b => b._id === savedBrand._id ? savedBrand : b));
                } else {
                    setBrands([...brands, savedBrand]);
                }

                notyf.success(`Brand ${editingBrand ? 'updated' : 'added'} successfully`);
                handleCloseDrawer();

                // Notify other components to refresh
                notifyBrandUpdate();

                // Refetch in background to ensure consistency
                fetchBrands();
            } else {
                notyf.error('Failed to save brand');
            }
        } catch (error) {
            notyf.error('Error saving brand');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this brand? Products associated with it will still exist but might not show up in filtered views.')) return;
        const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

        // Optimistically remove from UI
        const previousBrands = [...brands];
        setBrands(brands.filter(b => b._id !== id));

        try {
            const res = await fetch(`/api/product-models/${id}`, { method: 'DELETE' });
            if (res.ok) {
                notyf.success('Brand deleted successfully');
                // Notify other components to refresh
                notifyBrandUpdate();
                // Refetch to ensure consistency
                fetchBrands();
            } else {
                // Rollback on error
                setBrands(previousBrands);
                notyf.error('Failed to delete brand');
            }
        } catch (error) {
            // Rollback on error
            setBrands(previousBrands);
            notyf.error('Error deleting brand');
        }
    };

    return (
        <DashboardLayout>
            <div className='dashboard-header'>
                <div className='dashboard-header-left'>
                    <h1>Brand Management</h1>
                    <p>Manage product categories and brands</p>
                </div>
                <div className='dashboard-header-right'>
                    <button onClick={() => handleOpenDrawer()} className='dashboard-header-btn'>
                        <FiPlus />
                        Add Brand
                    </button>
                </div>
            </div>

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
                                        <div className="brand-thumbnail">
                                            <img
                                                src={brand.image || 'https://placehold.co/100x100?text=No+Img'}
                                                alt={brand.label}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="brand-label-cell">
                                            <FiTag /> {brand.label}
                                        </div>
                                    </td>
                                    <td><code>{brand.value}</code></td>
                                    <td>
                                        <div className="brand-desc-cell">{brand.description || '-'}</div>
                                    </td>
                                    <td>
                                        <div className='dashboard-actions'>
                                            <button
                                                className='dashboard-action-btn edit'
                                                onClick={() => handleOpenDrawer(brand)}
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

            {/* Sliding Drawer Overlay */}
            <div className={`brand-drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={handleCloseDrawer}>
                <div className={`brand-drawer ${drawerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="brand-drawer-header">
                        <h2>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
                        <button onClick={handleCloseDrawer} className="brand-drawer-close">
                            <FiX />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="brand-drawer-form">
                        <div className="form-group">
                            <label>Display Name (Label)</label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="e.g. Blanton's"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>URL Slug (Value)</label>
                            <input
                                type="text"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="e.g. blantons"
                                required
                                disabled={editingBrand}
                            />
                            <small>This is used in URLs and filtering. Once set, it cannot be changed.</small>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Write a brief description of this brand..."
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label>Brand Image</label>
                            <div className="image-management">
                                <div className="image-preview-large">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Brand Preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <FiImage size={40} />
                                            <span>No image selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="image-actions">
                                    <button
                                        type="button"
                                        className="image-btn"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <FiUpload /> Upload Image
                                    </button>
                                    <div className="url-input-group">
                                        <FiCloud />
                                        <input
                                            type="text"
                                            placeholder="Paste Image URL instead..."
                                            value={formData.image?.startsWith('data:') ? '' : formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="brand-drawer-footer">
                            <button
                                type="button"
                                onClick={handleCloseDrawer}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-save"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <><div className="small-spinner"></div> Saving...</>
                                ) : (
                                    <><FiCheck /> {editingBrand ? 'Update Brand' : 'Save Brand'}</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .brand-thumbnail {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                }
                .brand-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .brand-label-cell {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                }
                .brand-desc-cell {
                    max-width: 250px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: var(--color-text-muted);
                }
                .brand-drawer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .brand-drawer-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }
                .brand-drawer {
                    position: fixed;
                    top: 0;
                    right: -500px;
                    width: 500px;
                    height: 100%;
                    background: #111;
                    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
                    z-index: 1001;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: flex;
                    flex-direction: column;
                }
                .brand-drawer.open {
                    right: 0;
                }
                .brand-drawer-header {
                    padding: 24px;
                    border-bottom: 1px solid var(--color-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .brand-drawer-header h2 {
                    font-size: 20px;
                    color: var(--color-gold);
                }
                .brand-drawer-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
                .brand-drawer-form {
                    flex: 1;
                    padding: 24px;
                    overflow-y: auto;
                }
                .form-group {
                    margin-bottom: 24px;
                }
                .form-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--color-text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    color: white;
                    outline: none;
                    transition: all 0.2s;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--color-gold);
                    background: rgba(255, 255, 255, 0.08);
                }
                .form-group small {
                    display: block;
                    margin-top: 6px;
                    font-size: 11px;
                    color: var(--color-text-muted);
                }
                .image-management {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .image-preview-large {
                    width: 100%;
                    height: 200px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px dashed var(--color-border);
                }
                .image-preview-large img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    color: var(--color-text-muted);
                }
                .image-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .image-btn {
                    padding: 10px;
                    background: var(--color-gold);
                    color: black;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .url-input-group {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    padding: 0 16px;
                }
                .url-input-group input {
                    border: none;
                    background: none;
                }
                .brand-drawer-footer {
                    padding: 24px;
                    border-top: 1px solid var(--color-border);
                    display: flex;
                    gap: 12px;
                }
                .btn-cancel {
                    flex: 1;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                }
                .btn-save {
                    flex: 2;
                    padding: 12px;
                    background: var(--color-gold);
                    border: none;
                    border-radius: 10px;
                    color: black;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .btn-save:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .small-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                    border-top: 2px solid black;
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
