import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : type === 'warning' ? '⚡' : 'ℹ️';

    return (
        <div
            className={`toast toast-${type}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s ease',
            }}
        >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{message}</span>
        </div>
    );
};

// Toast Manager Hook
export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastProps['type'] }>>([]);

    const showToast = (message: string, type: ToastProps['type'] = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};

export default Toast;
