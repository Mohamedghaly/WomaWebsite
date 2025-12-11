import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('admin@woma.com');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            console.log('Login successful, navigating to dashboard...');

            // Use React Router's navigate which respects HashRouter
            navigate('/admin/dashboard', { replace: true });
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>
                            🛍️ <span>Woma Admin</span>
                        </h1>
                        <p>E-commerce Dashboard</p>
                    </div>

                    {error && (
                        <div className="error-message" style={{ display: 'block', marginBottom: '20px', background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="admin@woma.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                            {loading && <div className="spinner" style={{ border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="hint" style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '20px' }}>
                            Default: admin@woma.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
