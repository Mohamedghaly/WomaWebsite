import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading, user } = useAdminAuth();

    console.log('ProtectedRoute - Auth status:', { isAuthenticated, loading, user: user?.email });

    if (loading) {
        console.log('ProtectedRoute - Still loading auth...');
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
                    <div>Loading...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('ProtectedRoute - Not authenticated, redirecting to login...');
        return <Navigate to="/admin/login" replace />;
    }

    console.log('ProtectedRoute - Authenticated, showing protected content');
    return <>{children}</>;
};

export default ProtectedRoute;
