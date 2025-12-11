import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../components/admin/Toast';
import { adminApi, Product, Category, ProductVariation, Color, Size, formatCurrency } from '../../services/admin/adminApi';
import { Settings, Plus, Trash2, Edit2, Layers, X, Save } from 'lucide-react';

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [loadingVariations, setLoadingVariations] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
    const [isDeleteVariationOpen, setIsDeleteVariationOpen] = useState(false);

    // Selection states
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [selectedProductForVariations, setSelectedProductForVariations] = useState<Product | null>(null);

    // Variation Management
    const [variations, setVariations] = useState<ProductVariation[]>([]);
    const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
    const [deletingVariationId, setDeletingVariationId] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const { showToast, ToastContainer } = useToast();

    // Product Form Data
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        image_url: '',
        is_active: true,
    });

    // Variation Form Data
    const [variationFormData, setVariationFormData] = useState({
        name: '',
        color: '',
        size: '',
        stock_quantity: 0,
        price_adjustment: 0,
        is_active: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, categoriesData, colorsData, sizesData] = await Promise.all([
                adminApi.getProducts(),
                adminApi.getCategories(),
                adminApi.getColors(),
                adminApi.getSizes()
            ]);
            setProducts(Array.isArray(productsData) ? productsData : (productsData as any).results || []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData as any).results || []);
            setColors(Array.isArray(colorsData) ? colorsData : (colorsData as any).results || []);
            setSizes(Array.isArray(sizesData) ? sizesData : (sizesData as any).results || []);
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Failed to load products data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- Product Logic ---

    const openProductModal = (product: Product | null = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: String(product.category),
                description: product.description || '',
                price: String(product.price),
                image_url: product.image_url || '',
                is_active: product.is_active,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                image_url: '',
                is_active: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeProductModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: parseFloat(formData.price),
                image_url: formData.image_url,
                is_active: formData.is_active,
                stock_quantity: 0, // Managed via variations
            };

            if (editingProduct) {
                await adminApi.updateProduct(editingProduct.id, data);
                showToast('Product updated successfully', 'success');
            } else {
                await adminApi.createProduct(data);
                showToast('Product created successfully', 'success');
            }

            closeProductModal();
            loadData();
        } catch (error: any) {
            console.error('Error saving product:', error);
            showToast(error.detail || 'Error saving product', 'error');
        }
    };

    const handleDeleteProduct = async () => {
        if (!deletingProductId) return;
        try {
            await adminApi.deleteProduct(deletingProductId);
            showToast('Product deleted successfully', 'success');
            loadData();
        } catch (error) {
            showToast('Error deleting product', 'error');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    // --- Variation Logic ---

    const openVariationModal = async (product: Product) => {
        setSelectedProductForVariations(product);
        setIsVariationModalOpen(true);
        setLoadingVariations(true);
        setEditingVariation(null);
        resetVariationForm();

        try {
            const data = await adminApi.getVariations(product.id as any); // Type cast if needed depending on API signature update
            setVariations(data);
        } catch (error) {
            console.error('Error loading variations:', error);
            showToast('Failed to load variations', 'error');
        } finally {
            setLoadingVariations(false);
        }
    };

    const resetVariationForm = () => {
        setVariationFormData({
            name: '',
            color: '',
            size: '',
            stock_quantity: 0,
            price_adjustment: 0,
            is_active: true
        });
    };

    const handleEditVariation = (variation: ProductVariation) => {
        setEditingVariation(variation);
        setVariationFormData({
            name: variation.name,
            color: variation.attributes?.['Color'] || variation.attributes?.['color'] || '',
            size: variation.attributes?.['Size'] || variation.attributes?.['size'] || '',
            stock_quantity: variation.stock_quantity,
            price_adjustment: variation.price_adjustment,
            is_active: variation.is_active
        });
    };

    const handleVariationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductForVariations) return;

        try {
            // Construct attributes JSON
            const attributes: Record<string, string> = {};
            if (variationFormData.color) attributes['Color'] = variationFormData.color;
            if (variationFormData.size) attributes['Size'] = variationFormData.size;

            // Generate name if empty
            let name = variationFormData.name;
            if (!name) {
                name = `${variationFormData.color || ''} ${variationFormData.size || ''}`.trim();
                if (!name) name = 'Standard';
            }

            const data = {
                product: selectedProductForVariations.id,
                name: name,
                attributes: attributes,
                stock_quantity: Number(variationFormData.stock_quantity),
                price_adjustment: Number(variationFormData.price_adjustment),
                is_active: variationFormData.is_active
            };

            if (editingVariation) {
                await adminApi.updateVariation(editingVariation.id, data);
                showToast('Variation updated', 'success');
            } else {
                await adminApi.createVariation(data);
                showToast('Variation created', 'success');
            }

            // Refresh variations list
            const updatedVariations = await adminApi.getVariations(selectedProductForVariations.id as any);
            setVariations(updatedVariations);

            if (editingVariation) {
                // If editing, we reset everything to clear the form state
                setEditingVariation(null);
                resetVariationForm();
            } else {
                // If adding new, we keep the color selected for convenience
                setVariationFormData(prev => ({
                    ...prev,
                    name: '',
                    size: '',
                    // Keep color: prev.color
                    stock_quantity: 0,
                    price_adjustment: 0,
                    is_active: true
                }));
            }

        } catch (error: any) {
            console.error('Error saving variation:', error);
            showToast(error.detail || 'Error saving variation', 'error');
        }
    };

    const handleDeleteVariation = async () => {
        if (!deletingVariationId || !selectedProductForVariations) return;
        try {
            await adminApi.deleteVariation(deletingVariationId);
            showToast('Variation deleted', 'success');
            // Refresh list
            const updatedVariations = await adminApi.getVariations(selectedProductForVariations.id as any);
            setVariations(updatedVariations);
        } catch (error) {
            showToast('Error deleting variation', 'error');
        } finally {
            setIsDeleteVariationOpen(false);
        }
    };

    // --- Render Helpers ---

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = !categoryFilter || String(product.category) === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <div className="text-gray-500">Loading products...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer />

            <div className="page-header">
                <div>
                    <h1>Products Management</h1>
                    <p className="text-gray-500 mt-1">Manage your catalog, inventory, and variations</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={() => openProductModal()}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Controls */}
            <div className="card mb-6 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="search"
                        className="search-input flex-1"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="filter-select w-full md:w-64"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-600">Product</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-600">Category</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-600">Price</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-600">Stock</th>
                                <th className="text-center py-4 px-6 font-semibold text-gray-600">Status</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No products found. Use the "Add Product" button to create one.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                        📦
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-900">{product.name}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {product.category_name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-mono font-medium">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`font-bold ${(product.total_stock || 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {product.total_stock || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    onClick={() => openVariationModal(product)}
                                                    title="Manage Variations"
                                                >
                                                    <Layers size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    onClick={() => openProductModal(product)}
                                                    title="Edit Product"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    onClick={() => {
                                                        setDeletingProductId(product.id);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={closeProductModal}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={closeProductModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleProductSubmit}>
                            {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                    </>
                }
            >
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Base Price (EGP)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            Product is active and visible
                        </label>
                    </div>
                </form>
            </AdminModal>

            {/* Variations Management Modal */}
            {isVariationModalOpen && selectedProductForVariations && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Manage Variations</h2>
                                <p className="text-gray-500 text-sm">For: {selectedProductForVariations.name}</p>
                            </div>
                            <button onClick={() => setIsVariationModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left: Form */}
                                <div className="w-full lg:w-1/3 space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            {editingVariation ? <Edit2 size={16} /> : <Plus size={16} />}
                                            {editingVariation ? 'Edit Variation' : 'Add New Variation'}
                                        </h3>

                                        <form onSubmit={handleVariationSubmit} className="space-y-4">
                                            <div className="form-group">
                                                <label className="text-xs uppercase font-bold text-gray-500">Variation Name (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={variationFormData.name}
                                                    onChange={(e) => setVariationFormData({ ...variationFormData, name: e.target.value })}
                                                    placeholder="e.g. Red Small"
                                                    className="w-full text-sm"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="form-group">
                                                    <label className="text-xs uppercase font-bold text-gray-500">Color</label>
                                                    <select
                                                        value={variationFormData.color}
                                                        onChange={(e) => setVariationFormData({ ...variationFormData, color: e.target.value })}
                                                        className="w-full text-sm"
                                                    >
                                                        <option value="">None</option>
                                                        {colors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-xs uppercase font-bold text-gray-500">Size</label>
                                                    <select
                                                        value={variationFormData.size}
                                                        onChange={(e) => setVariationFormData({ ...variationFormData, size: e.target.value })}
                                                        className="w-full text-sm"
                                                    >
                                                        <option value="">None</option>
                                                        {sizes.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="form-group">
                                                    <label className="text-xs uppercase font-bold text-gray-500">Stock</label>
                                                    <input
                                                        type="number"
                                                        value={variationFormData.stock_quantity}
                                                        onChange={(e) => setVariationFormData({ ...variationFormData, stock_quantity: Number(e.target.value) })}
                                                        className="w-full text-sm"
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-xs uppercase font-bold text-gray-500">Price Adj. (+/-)</label>
                                                    <input
                                                        type="number"
                                                        value={variationFormData.price_adjustment}
                                                        onChange={(e) => setVariationFormData({ ...variationFormData, price_adjustment: Number(e.target.value) })}
                                                        className="w-full text-sm"
                                                        step="0.01"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="checkbox-label text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={variationFormData.is_active}
                                                        onChange={(e) => setVariationFormData({ ...variationFormData, is_active: e.target.checked })}
                                                    />
                                                    Active
                                                </label>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                {editingVariation && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setEditingVariation(null); resetVariationForm(); }}
                                                        className="btn btn-secondary flex-1 text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button type="submit" className="btn btn-primary flex-1 text-sm">
                                                    {editingVariation ? 'Update' : 'Add Variation'}
                                                </button>
                                            </div>
                                            {!editingVariation && (
                                                <p className="text-[10px] text-gray-400 text-center mt-2">
                                                    Tip: Color selection is kept for faster entry.
                                                </p>
                                            )}
                                        </form>
                                    </div>
                                </div>

                                {/* Right: List */}
                                <div className="w-full lg:w-2/3">
                                    {loadingVariations ? (
                                        <div className="flex justify-center p-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="py-3 px-4 text-left font-semibold">Name/Attrs</th>
                                                        <th className="py-3 px-4 text-center font-semibold">Stock</th>
                                                        <th className="py-3 px-4 text-right font-semibold">Price</th>
                                                        <th className="py-3 px-4 text-center font-semibold">Status</th>
                                                        <th className="py-3 px-4 text-right font-semibold">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {variations.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                                No variations yet. Add one from the left form.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        variations.map(variation => (
                                                            <tr key={variation.id} className="hover:bg-gray-50">
                                                                <td className="py-3 px-4">
                                                                    <div className="font-bold">{variation.name}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {/* Safe check for attributes if it's undefined or not an object */}
                                                                        {variation.attributes ? Object.entries(variation.attributes).map(([k, v]) => `${k}: ${v}`).join(', ') : 'No attributes'}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <span className={`font-mono font-bold ${variation.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                                        {variation.stock_quantity}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right font-mono text-gray-600">
                                                                    {variation.price_adjustment > 0 ? '+' : ''}{formatCurrency(variation.price_adjustment)}
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <span className={`w-2 h-2 rounded-full inline-block ${variation.is_active ? 'bg-green-500' : 'bg-red-300'}`}></span>
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        <button
                                                                            onClick={() => handleEditVariation(variation)}
                                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                                        >
                                                                            <Edit2 size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setDeletingVariationId(variation.id);
                                                                                setIsDeleteVariationOpen(true);
                                                                            }}
                                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                            <button onClick={() => setIsVariationModalOpen(false)} className="btn btn-primary">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Product */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Product"
                message="Are you sure? This will delete the product and ALL its variations."
                confirmText="Delete Everyone"
                cancelText="Cancel"
                isDestructive
                onConfirm={handleDeleteProduct}
                onCancel={() => setIsDeleteDialogOpen(false)}
            />

            {/* Confirm Delete Variation */}
            <ConfirmDialog
                isOpen={isDeleteVariationOpen}
                title="Delete Variation"
                message="Are you sure you want to delete this variation?"
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive
                onConfirm={handleDeleteVariation}
                onCancel={() => setIsDeleteVariationOpen(false)}
            />

        </AdminLayout>
    );
};

export default AdminProducts;
