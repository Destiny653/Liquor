'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AnalyticsPage from './analytics/page'
import './dashboard.css'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Wait for session to settle
        if (status === 'loading') return

        const checkAuth = async () => {
            try {
                let email = session?.user?.email

                // Fallback to localStorage
                if (!email && typeof window !== 'undefined') {
                    email = window.localStorage.getItem('email')
                }

                if (!email) {
                    console.log('No email found, redirecting to login...')
                    router.push('/login')
                    // Assuming redirect happens fast, but to be safe we stop loading
                    // Actually, if we return here, loading is true.
                    // This is usually fine as we navigate away.
                    return
                }

                console.log('Verifying role for:', email)
                const res = await fetch('/api/users')

                if (res.ok) {
                    const data = await res.json()
                    const users = data.users || []
                    const currentUser = users.find(u => u.email === email)

                    console.log('User found:', currentUser)

                    if (currentUser && currentUser.role === 'manager') {
                        setIsAuthorized(true)
                    } else {
                        setIsAuthorized(false)
                    }
                } else {
                    console.error('Failed to fetch users list')
                    setIsAuthorized(false)
                }
            } catch (error) {
                console.error('Auth verification error:', error)
                setIsAuthorized(false)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [session, status, router])

    if (loading || status === 'loading') {
        return (
            <div className='dashboard-loader'>
                {/* Re-using spinner styles if available, or inline style */}
                <div className="dashboard-spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    borderTopColor: 'var(--color-gold, #d4af37)',
                    animation: 'spin 1s ease-in-out infinite'
                }}></div>
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .dashboard-loader {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background: #121212;
                    }
                 `}</style>
            </div>
        )
    }

    if (!isAuthorized) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#121212',
                color: '#fff'
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#d4af37' }}>Unauthorized Access</h1>
                <p style={{ color: '#888', marginBottom: '2rem' }}>
                    You do not have permission to view this page.
                </p>
                <button
                    onClick={() => router.push('/')}
                    style={{
                        padding: '12px 24px',
                        background: '#d4af37',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Return Home
                </button>
            </div>
        )
    }

    // If authorized, render the Main Dashboard (Analytics)
    return <AnalyticsPage />
}
