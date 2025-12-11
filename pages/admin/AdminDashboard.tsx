import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi, DashboardStats, Order, formatCurrency } from '../../services/admin/adminApi';

interface ExtendedStats extends DashboardStats {
    total_categories?: number;
    total_customers?: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<ExtendedStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsData, ordersData] = await Promise.all([
                adminApi.getDashboardStats(),
                adminApi.getOrders({ page_size: '5' }),
            ]);

            setStats(statsData);
            // Handle both array response and paginated response
            const orders = Array.isArray(ordersData) ? ordersData : (ordersData as any).results || [];
            setRecentOrders(orders);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: 'badge-pending',
            processing: 'badge-processing',
            completed: 'badge-completed',
            cancelled: 'badge-cancelled',
        };
        return statusMap[status] || 'badge-pending';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div>Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="page-header">
                <h1>Dashboard Overview</h1>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <h3 id="total-products">{stats?.total_products || 0}</h3>
                        <p>Total Products</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                        <h3 id="total-categories">{stats?.total_categories || 0}</h3>
                        <p>Categories</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                        <h3 id="total-orders">{stats?.total_orders || 0}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3 id="pending-orders">{stats?.pending_orders || 0}</h3>
                        <p>Pending Orders</p>
                    </div>
                </div>

                {stats?.total_revenue !== undefined && (
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h3 id="total-revenue">{formatCurrency(stats.total_revenue)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                )}

                {stats?.total_customers !== undefined && (
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3 id="total-customers">{stats.total_customers}</h3>
                            <p>Total Customers</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="card-header">
                    <h2>Recent Orders</h2>
                </div>
                <div className="card-body" id="recent-orders-list">
                    {recentOrders.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No recent orders</p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{String(order.id).substring(0, 8)}</td>
                                            <td>{order.user_email || 'N/A'}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(order.total)}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
