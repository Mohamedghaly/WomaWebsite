import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../components/admin/Toast';
import { adminApi, Category } from '../../services/admin/adminApi';

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

    const { showToast, ToastContainer } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await adminApi.getCategories();
            setCategories(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            showToast('Failed to load categories', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openCategoryModal = (category: Category | null = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await adminApi.updateCategory(editingCategory.id, formData);
                showToast('Category updated successfully', 'success');
            } else {
                await adminApi.createCategory(formData);
                showToast('Category created successfully', 'success');
            }

            closeCategoryModal();
            loadCategories();
        } catch (error: any) {
            showToast(error.name?.[0] || 'Error saving category', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deletingCategoryId) return;

        try {
            await adminApi.deleteCategory(deletingCategoryId);
            showToast('Category deleted successfully', 'success');
            loadCategories();
        } catch (error) {
            showToast('Error deleting category. It may have products associated with it.', 'error');
        }
    };

    const openDeleteDialog = (id: number) => {
        setDeletingCategoryId(id);
        setIsDeleteDialogOpen(true);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
                    <div>Loading categories...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer />

            <div className="page-header">
                <h1>Categories Management</h1>
                <button className="btn btn-primary" onClick={() => openCategoryModal()}>
                    + Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div>
                {categories.length === 0 ? (
                    <div className="card">
                        <div className="card-body">
                            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                No categories found. Click "Add Category" to create one.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <div key={category.id} className="category-card">
                                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
                                    {category.name}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px', minHeight: '40px' }}>
                                    {category.description || 'No description'}
                                </p>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => openCategoryModal(category)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => openDeleteDialog(category.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Form Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={closeCategoryModal}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={closeCategoryModal}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            {editingCategory ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="category-name">Category Name</label>
                        <input
                            type="text"
                            id="category-name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category-description">Description</label>
                        <textarea
                            id="category-description"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </form>
            </AdminModal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
            />
        </AdminLayout>
    );
};

export default AdminCategories;
