'use client';
import React, { useState, useEffect, Suspense } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiUsers, FiActivity } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function AnalyticsContent() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        avgOrderValue: 0
    });
    const [chartData, setChartData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, usersRes] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/users')
                ]);

                if (ordersRes.ok && usersRes.ok) {
                    const ordersData = await ordersRes.json();
                    const usersData = await usersRes.json();

                    if (ordersData.success && usersData.success) {
                        processAnalytics(ordersData.order, usersData.users);
                    }
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processAnalytics = (orders, users) => {
        let totalRevenue = 0;
        let totalOrders = 0;
        const productSales = {};

        // Process Orders
        orders.forEach(orderDoc => {
            if (orderDoc.orders) {
                orderDoc.orders.forEach(orderItem => {
                    totalRevenue += orderItem.totalPrice || 0;
                    totalOrders += 1;

                    // Track product sales
                    if (orderItem.products) {
                        orderItem.products.forEach(prod => {
                            const title = prod.productId?.title || 'Unknown Product';
                            if (productSales[title]) {
                                productSales[title] += prod.quantity || 1;
                            } else {
                                productSales[title] = prod.quantity || 1;
                            }
                        });
                    }
                });
            }
        });

        // Calculate KPI
        setStats({
            revenue: totalRevenue,
            orders: totalOrders,
            customers: users.length,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        });

        // Top Products
        const sortedProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, sales]) => ({ name, sales }));

        // Calculate percentage for progress bars
        const maxSales = sortedProducts[0]?.sales || 1;
        setTopProducts(sortedProducts.map(p => ({ ...p, percent: (p.sales / maxSales) * 100 })));

        // Chart Data (Mocking daily distribution based on total revenue for demo purposes if dates are old)
        // Ideally we group by date.
        // Let's try to group by date from actual data
        // Chart Data
        const dailyRevenue = {};
        orders.forEach(orderDoc => {
            if (orderDoc.orders) {
                orderDoc.orders.forEach(item => {
                    const dateVal = item.orderDate || orderDoc.createdAt;
                    const date = new Date(dateVal).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    dailyRevenue[date] = (dailyRevenue[date] || 0) + (item.totalPrice || 0);
                });
            }
        });

        const chart = Object.keys(dailyRevenue).map(date => ({
            name: date,
            value: dailyRevenue[date]
        })).slice(-7); // Last 7 entries

        // If not enough data, pad with 0s or keep what we have
        setChartData(chart.length > 0 ? chart : [
            { name: 'Mon', value: 0 }, { name: 'Tue', value: 0 }, { name: 'Wed', value: 0 },
            { name: 'Thu', value: 0 }, { name: 'Fri', value: 0 }, { name: 'Sat', value: 0 }, { name: 'Sun', value: 0 }
        ]);
    };

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    return (
        <DashboardLayout>
            {loading ? (
                <div className='dashboard-loader'>
                    <div className='dashboard-spinner'></div>
                </div>
            ) : (
                <>
                    <div className='dashboard-header'>
                        <div className='dashboard-header-left'>
                            <h1>Analytics</h1>
                            <p>Overview of store performance</p>
                        </div>
                        <div className='dashboard-header-right'>
                            <select style={{
                                padding: '10px 16px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '10px',
                                color: 'var(--color-text-primary)',
                                outline: 'none'
                            }}>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>

                    <div className='dashboard-stats'>
                        <div className='dashboard-stat-card'>
                            <div className='dashboard-stat-header'>
                                <div className='dashboard-stat-icon accent'>
                                    <FiDollarSign />
                                </div>
                                <span className='dashboard-stat-change positive'>
                                    <FiTrendingUp size={12} /> +12.5%
                                </span>
                            </div>
                            <h3 className='dashboard-stat-value'>{formatter.format(stats.revenue)}</h3>
                            <p className='dashboard-stat-label'>Total Revenue</p>
                        </div>

                        <div className='dashboard-stat-card'>
                            <div className='dashboard-stat-header'>
                                <div className='dashboard-stat-icon green'>
                                    <FiShoppingBag />
                                </div>
                                <span className='dashboard-stat-change positive'>
                                    <FiTrendingUp size={12} /> +8.2%
                                </span>
                            </div>
                            <h3 className='dashboard-stat-value'>{stats.orders}</h3>
                            <p className='dashboard-stat-label'>Total Orders</p>
                        </div>

                        <div className='dashboard-stat-card'>
                            <div className='dashboard-stat-header'>
                                <div className='dashboard-stat-icon blue'>
                                    <FiUsers />
                                </div>
                                <span className='dashboard-stat-change positive'>
                                    <FiTrendingUp size={12} /> +2.1%
                                </span>
                            </div>
                            <h3 className='dashboard-stat-value'>{stats.customers}</h3>
                            <p className='dashboard-stat-label'>Total Customers</p>
                        </div>

                        <div className='dashboard-stat-card'>
                            <div className='dashboard-stat-header'>
                                <div className='dashboard-stat-icon'>
                                    <FiActivity />
                                </div>
                                <span className='dashboard-stat-change positive'>
                                    <FiTrendingUp size={12} /> +5.4%
                                </span>
                            </div>
                            <h3 className='dashboard-stat-value'>{formatter.format(stats.avgOrderValue)}</h3>
                            <p className='dashboard-stat-label'>Avg. Order Value</p>
                        </div>
                    </div>

                    <div className='dashboard-grid-two-one'>
                        <div className='dashboard-card dashboard-chart-card'>
                            <h3 className='dashboard-card-title'>Revenue Overview</h3>
                            <div className='dashboard-chart-container'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-gold)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--color-gold)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                            tickFormatter={(val) => `$${val}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: '8px',
                                                color: 'var(--color-text-primary)'
                                            }}
                                            itemStyle={{ color: 'var(--color-gold)' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--color-gold)"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className='dashboard-card dashboard-top-products-card'>
                            <h3 className='dashboard-card-title'>Top Products</h3>
                            <ul className='top-products-list'>
                                {topProducts.length > 0 ? topProducts.map((item, i) => (
                                    <li key={i} className='top-product-item'>
                                        <div className='top-product-info'>
                                            <span>{item.name}</span>
                                            <span className='sales-count'>{item.sales} sold</span>
                                        </div>
                                        <div className='progress-bar-bg'>
                                            <div className='progress-bar-fill' style={{ width: `${item.percent}%` }}></div>
                                        </div>
                                    </li>
                                )) : (
                                    <li className='empty-text'>No sales data yet</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={
            <div className='dashboard-loader'>
                <div className='dashboard-spinner'></div>
            </div>
        }>
            <AnalyticsContent />
        </Suspense>
    );
}
