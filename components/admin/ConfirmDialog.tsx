import React from 'react';
import AdminModal from './AdminModal';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = false,
}) => {
    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onCancel}
            title={title}
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                    >
                        {confirmText}
                    </button>
                </>
            }
        >
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#334155' }}>{message}</p>
        </AdminModal>
    );
};

export default ConfirmDialog;
