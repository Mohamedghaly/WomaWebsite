import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi, User, LoginResponse } from '../services/admin/adminApi';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const profile = await adminApi.getProfile();
                    setUser(profile);
                } catch (error) {
                    console.error('Failed to get profile:', error);
                    localStorage.clear();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('🔐 AdminAuth: Starting login...', email);
            const response: any = await adminApi.login(email, password);
            console.log('✅ AdminAuth: Login API successful, response:', response);

            // Handle both response formats: {access, refresh} or {tokens: {access, refresh}}
            const accessToken = response.access || response.tokens?.access;
            const refreshToken = response.refresh || response.tokens?.refresh;

            if (!accessToken || !refreshToken) {
                throw new Error('Invalid response: missing tokens');
            }

            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            console.log('💾 AdminAuth: Tokens saved to localStorage');

            setUser(response.user);
            console.log('👤 AdminAuth: User state set:', response.user);
            console.log('✨ AdminAuth: Login complete, isAuthenticated should be true');
        } catch (error: any) {
            console.error('❌ AdminAuth: Login failed:', error);
            throw new Error(error.detail || error.message || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        // Use hash routing for proper navigation (without # prefix)
        window.location.hash = '/admin/login';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
};
