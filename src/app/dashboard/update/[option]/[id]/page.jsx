'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import {
  FiUpload, FiImage, FiDollarSign, FiStar,
  FiFileText, FiPackage, FiArrowLeft, FiCheck, FiSave
} from 'react-icons/fi';
import { Notyf } from 'notyf';

export default function UpdatePage({ params }) {
  const { option, id } = params;
  const router = useRouter();

  // State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [rate, setRate] = useState('');
  const [content, setContent] = useState('');
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Determine the correct endpoint based on option pluralization
        // The current structure suggests 'option' might already be pluralized or needs 's'
        // Based on previous code: /api/${option.toLowerCase()}s/${id}
        // But params.option from URL might vary. Let's assume params.option is the product model name
        // e.g. "baltons" or "balton"

        // Let's try to fetch
        const res = await fetch(`/api/${option}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title || '');
          setPrice(data.price || '');
          setRate(data.rate || '');
          setContent(data.content || '');
          setImgSrc(data.img || '');
        } else {
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [option, id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const url = e.dataTransfer.getData('text/plain');
    if (url) {
      setImgSrc(url);
    } else if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImgSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
    setSaving(true);

    try {
      const response = await fetch(`/api/${option}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          content,
          rate: parseInt(rate) || 5,
          img: imgSrc
        })
      });

      if (response.ok) {
        notyf.success('Product updated successfully!');
        router.push('/dashboard/posts');
      } else {
        notyf.error('Failed to update product');
      }
    } catch (error) {
      notyf.error('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='dashboard-loader'>
          <div className='dashboard-spinner'></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className='dashboard-header'>
        <div className='dashboard-header-left'>
          <h1>Edit Product</h1>
          <p>Update product details and inventory</p>
        </div>
        <div className='dashboard-header-right'>
          <Link href='/dashboard/posts' className='dashboard-header-btn dashboard-header-btn-secondary'>
            <FiArrowLeft />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Form Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Form */}
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>
            <h3 className='dashboard-card-title'>Product Details</h3>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* Title & Rating Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '8px'
                }}>
                  <FiPackage style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Product Title *
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Product Name'
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    color: 'var(--color-text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '8px'
                }}>
                  <FiStar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Rating (1-5)
                </label>
                <input
                  type='number'
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  min='1'
                  max='5'
                  placeholder='5'
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    color: 'var(--color-text-primary)',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-secondary)',
                marginBottom: '8px'
              }}>
                <FiDollarSign style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Price (USD) *
              </label>
              <input
                type='number'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder='0.00'
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-text-primary)',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-secondary)',
                marginBottom: '8px'
              }}>
                <FiFileText style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Description *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Enter product description...'
                rows={5}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-text-primary)',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={saving}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: 'var(--gradient-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <FiSave />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Image Upload */}
        <div className='dashboard-card' style={{ height: 'fit-content' }}>
          <div className='dashboard-card-header'>
            <h3 className='dashboard-card-title'>Product Image</h3>
          </div>

          <div style={{ padding: '24px' }}>
            {/* URL Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-secondary)',
                marginBottom: '8px'
              }}>
                Image URL
              </label>
              <input
                type='url'
                value={imgSrc}
                onChange={(e) => setImgSrc(e.target.value)}
                placeholder='https://example.com/image.jpg'
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--color-gold)' : 'var(--color-border)'}`,
                borderRadius: '16px',
                padding: '40px 20px',
                textAlign: 'center',
                background: dragActive ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s',
                marginBottom: '20px'
              }}
            >
              <FiUpload size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>
                Drag & drop an image here
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
                or
              </p>
              <label style={{
                padding: '10px 20px',
                background: 'var(--color-gold)',
                color: 'var(--color-bg-primary)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Choose File
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Preview */}
            {imgSrc && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '8px'
                }}>
                  <FiImage style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Preview
                </label>
                <img
                  src={imgSrc}
                  alt='Product preview'
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}