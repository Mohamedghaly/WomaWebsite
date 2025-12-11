import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAdminAuth();

    const navItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/products', icon: '📦', label: 'Products' },
        { path: '/admin/categories', icon: '🏷️', label: 'Categories' },
        { path: '/admin/orders', icon: '🛒', label: 'Orders' },
        { path: '/admin/utilities', icon: '⚙️', label: 'Utilities' },
        { path: '/admin/settings', icon: '🎨', label: 'Website Settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Woma Admin</h2>
                    <p>E-commerce Dashboard</p>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '24px 20px', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '12px' }}>
                        <div id="user-email">{user?.email}</div>
                    </div>
                    <button
                        id="logout-btn"
                        onClick={logout}
                        className="btn btn-secondary btn-block btn-sm"
                        style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">{children}</main>
        </div>
    );
};

export default AdminLayout;
