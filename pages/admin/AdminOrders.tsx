import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminModal from '../../components/admin/AdminModal';
import { useToast } from '../../components/admin/Toast';
import { adminApi, Order, formatCurrency, formatDate } from '../../services/admin/adminApi';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState('');

    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        try {
            const data = statusFilter
                ? await adminApi.getOrders({ status: statusFilter })
                : await adminApi.getOrders();
            setOrders(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error('Error loading orders:', error);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const viewOrder = async (id: number) => {
        try {
            const order = await adminApi.getOrder(id);
            setSelectedOrder(order);
            setIsModalOpen(true);
        } catch (error) {
            showToast('Error loading order details', 'error');
        }
    };

    const updateStatus = async (orderId: number, status: Order['status']) => {
        try {
            await adminApi.updateOrderStatus(orderId, status);
            showToast('Order status updated successfully', 'success');
            setIsModalOpen(false);
            loadOrders();
        } catch (error: any) {
            showToast(error.status?.[0] || error.detail || 'Error updating order status', 'error');
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
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                    <div>Loading orders...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer />

            <div className="page-header">
                <h1>Orders Management</h1>
            </div>

            {/* Status Filter */}
            <div className="table-controls">
                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="card-body">
                    {orders.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                            No orders found.
                        </p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <strong>#{String(order.id).substring(0, 8)}</strong>
                                            </td>
                                            <td>
                                                <div className="text-sm font-medium">{order.customer_name || 'Guest'}</div>
                                                <div className="text-xs text-gray-400">{order.customer_email || order.user_email || ''}</div>
                                            </td>
                                            <td>{order.item_count || 0}</td>
                                            <td>
                                                <strong>{formatCurrency(order.total_amount)}</strong>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => viewOrder(order.id)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Order #${String(selectedOrder.id).substring(0, 8)}`}
                >
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ marginBottom: '8px' }}>
                            <strong>Customer:</strong> {selectedOrder.customer_name || 'Guest'} <br />
                            <span className="text-gray-500 text-sm">
                                {selectedOrder.customer_email || selectedOrder.user_email || 'No email'}<br />
                                {selectedOrder.customer_phone}
                            </span>
                        </p>
                        <p style={{ marginBottom: '8px' }}>
                            <strong>Status:</strong>{' '}
                            <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                                {selectedOrder.status}
                            </span>
                        </p>
                        <p style={{ marginBottom: '8px' }}>
                            <strong>Total:</strong> {formatCurrency(selectedOrder.total_amount)}
                        </p>
                        <p style={{ marginBottom: '8px' }}>
                            <strong>Date:</strong> {formatDate(selectedOrder.created_at)}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            Order Items
                        </h3>
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="font-semibold">{item.product_name}</div>
                                                    {item.variation_name && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {/* If we have structure like "Product Name - Variation Name", we might just want the Variation Name part, 
                                                                but variation_name from backend is __str__ which is "Product - Variation". 
                                                                Let's try to use variation_details if available purely. */}
                                                            {item.variation_details ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {Object.entries(item.variation_details).map(([key, val]) => (
                                                                        <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                            {key}: {val}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span>{item.variation_name}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>{formatCurrency(item.price_at_purchase)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: '#64748b' }}>No items</p>
                        )}
                    </div>

                    {/* Update Status */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            Update Status
                        </h3>
                        {['completed', 'cancelled'].includes(selectedOrder.status) ? (
                            <p style={{ color: '#64748b', fontSize: '14px' }}>
                                Status cannot be changed for {selectedOrder.status} orders.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => updateStatus(selectedOrder.id, 'pending')}
                                    disabled={selectedOrder.status === 'pending'}
                                >
                                    Pending
                                </button>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => updateStatus(selectedOrder.id, 'processing')}
                                    disabled={selectedOrder.status === 'processing'}
                                >
                                    Processing
                                </button>
                                <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => updateStatus(selectedOrder.id, 'completed')}
                                >
                                    Completed
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => updateStatus(selectedOrder.id, 'cancelled')}
                                >
                                    Cancelled
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Close
                        </button>
                    </div>
                </AdminModal>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;
