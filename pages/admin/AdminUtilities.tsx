import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../components/admin/Toast';
import { adminApi, Color, Size, DeliveryLocation, formatCurrency } from '../../services/admin/adminApi';

type UtilityTab = 'colors' | 'sizes' | 'locations';

const AdminUtilities: React.FC = () => {
    const [activeTab, setActiveTab] = useState<UtilityTab>('colors');
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [locations, setLocations] = useState<DeliveryLocation[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

    const { showToast, ToastContainer } = useToast();

    // Form state
    const [colorForm, setColorForm] = useState({ name: '', hex_code: '#000000' });
    const [sizeForm, setSizeForm] = useState({ name: '', abbreviation: '' });
    const [locationForm, setLocationForm] = useState({ name: '', price: '', is_active: true });

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            const [colorsData, sizesData, locationsData] = await Promise.all([
                adminApi.getColors(),
                adminApi.getSizes(),
                adminApi.getDeliveryLocations(),
            ]);
            setColors(Array.isArray(colorsData) ? colorsData : (colorsData as any).results || []);
            setSizes(Array.isArray(sizesData) ? sizesData : (sizesData as any).results || []);
            setLocations(Array.isArray(locationsData) ? locationsData : (locationsData as any).results || []);
        } catch (error) {
            console.error('Error loading utilities:', error);
            showToast('Failed to load utilities', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Colors CRUD
    const openColorModal = (color: Color | null = null) => {
        if (color) {
            setEditingItem(color);
            setColorForm({ name: color.name, hex_code: color.hex_code });
        } else {
            setEditingItem(null);
            setColorForm({ name: '', hex_code: '#000000' });
        }
        setIsModalOpen(true);
    };

    const handleColorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await adminApi.updateColor(editingItem.id, colorForm);
                showToast('Color updated successfully', 'success');
            } else {
                await adminApi.createColor(colorForm);
                showToast('Color created successfully', 'success');
            }
            setIsModalOpen(false);
            loadAllData();
        } catch (error: any) {
            showToast(error.name?.[0] || 'Error saving color', 'error');
        }
    };

    const deleteColor = async () => {
        if (!deletingItemId) return;
        try {
            await adminApi.deleteColor(deletingItemId);
            showToast('Color deleted successfully', 'success');
            loadAllData();
        } catch (error) {
            showToast('Error deleting color', 'error');
        }
    };

    // Sizes CRUD
    const openSizeModal = (size: Size | null = null) => {
        if (size) {
            setEditingItem(size);
            setSizeForm({ name: size.name, abbreviation: size.abbreviation });
        } else {
            setEditingItem(null);
            setSizeForm({ name: '', abbreviation: '' });
        }
        setIsModalOpen(true);
    };

    const handleSizeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await adminApi.updateSize(editingItem.id, sizeForm);
                showToast('Size updated successfully', 'success');
            } else {
                await adminApi.createSize(sizeForm);
                showToast('Size created successfully', 'success');
            }
            setIsModalOpen(false);
            loadAllData();
        } catch (error: any) {
            showToast(error.name?.[0] || 'Error saving size', 'error');
        }
    };

    const deleteSize = async () => {
        if (!deletingItemId) return;
        try {
            await adminApi.deleteSize(deletingItemId);
            showToast('Size deleted successfully', 'success');
            loadAllData();
        } catch (error) {
            showToast('Error deleting size', 'error');
        }
    };

    // Locations CRUD
    const openLocationModal = (location: DeliveryLocation | null = null) => {
        if (location) {
            setEditingItem(location);
            setLocationForm({ name: location.name, price: String(location.price), is_active: location.is_active });
        } else {
            setEditingItem(null);
            setLocationForm({ name: '', price: '', is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleLocationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = { ...locationForm, price: parseFloat(locationForm.price) };
            if (editingItem) {
                await adminApi.updateDeliveryLocation(editingItem.id, data);
                showToast('Delivery location updated successfully', 'success');
            } else {
                await adminApi.createDeliveryLocation(data);
                showToast('Delivery location created successfully', 'success');
            }
            setIsModalOpen(false);
            loadAllData();
        } catch (error: any) {
            showToast(error.name?.[0] || 'Error saving delivery location', 'error');
        }
    };

    const deleteLocation = async () => {
        if (!deletingItemId) return;
        try {
            await adminApi.deleteDeliveryLocation(deletingItemId);
            showToast('Delivery location deleted successfully', 'success');
            loadAllData();
        } catch (error) {
            showToast('Error deleting delivery location', 'error');
        }
    };

    const openDeleteDialog = (id: number) => {
        setDeletingItemId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (activeTab === 'colors') await deleteColor();
        else if (activeTab === 'sizes') await deleteSize();
        else await deleteLocation();
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
                    <div>Loading utilities...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer />

            <div className="page-header">
                <h1>Utilities Management</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
                <button
                    className={`btn ${activeTab === 'colors' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('colors')}
                    style={{ borderRadius: '8px 8px 0 0' }}
                >
                    🎨 Colors
                </button>
                <button
                    className={`btn ${activeTab === 'sizes' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('sizes')}
                    style={{ borderRadius: '8px 8px 0 0' }}
                >
                    📏 Sizes
                </button>
                <button
                    className={`btn ${activeTab === 'locations' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('locations')}
                    style={{ borderRadius: '8px 8px 0 0' }}
                >
                    📍 Delivery Locations
                </button>
            </div>

            {/* Colors Tab */}
            {activeTab === 'colors' && (
                <div className="card">
                    <div className="card-header">
                        <h2>Colors</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => openColorModal()}>
                            + Add Color
                        </button>
                    </div>
                    <div className="card-body">
                        {colors.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                No colors found.
                            </p>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Color</th>
                                            <th>Name</th>
                                            <th>Hex Code</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {colors.map((color) => (
                                            <tr key={color.id}>
                                                <td>
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: color.hex_code,
                                                            borderRadius: '8px',
                                                            border: '2px solid #e2e8f0',
                                                        }}
                                                    />
                                                </td>
                                                <td><strong>{color.name}</strong></td>
                                                <td><code>{color.hex_code}</code></td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => openColorModal(color)}
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => openDeleteDialog(color.id)}
                                                    >
                                                        Delete
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
            )}

            {/* Sizes Tab */}
            {activeTab === 'sizes' && (
                <div className="card">
                    <div className="card-header">
                        <h2>Sizes</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => openSizeModal()}>
                            + Add Size
                        </button>
                    </div>
                    <div className="card-body">
                        {sizes.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                No sizes found.
                            </p>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Abbreviation</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizes.map((size) => (
                                            <tr key={size.id}>
                                                <td><strong>{size.name}</strong></td>
                                                <td>{size.abbreviation}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => openSizeModal(size)}
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => openDeleteDialog(size.id)}
                                                    >
                                                        Delete
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
            )}

            {/* Delivery Locations Tab */}
            {activeTab === 'locations' && (
                <div className="card">
                    <div className="card-header">
                        <h2>Delivery Locations</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => openLocationModal()}>
                            + Add Location
                        </button>
                    </div>
                    <div className="card-body">
                        {locations.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                No delivery locations found.
                            </p>
                        ) : (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Location</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations.map((location) => (
                                            <tr key={location.id}>
                                                <td><strong>{location.name}</strong></td>
                                                <td>{formatCurrency(location.price)}</td>
                                                <td>
                                                    <span className={`badge ${location.is_active ? 'badge-active' : 'badge-inactive'}`}>
                                                        {location.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => openLocationModal(location)}
                                                        style={{ marginRight: '8px' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => openDeleteDialog(location.id)}
                                                    >
                                                        Delete
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
            )}

            {/* Modal for Forms */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    activeTab === 'colors'
                        ? editingItem ? 'Edit Color' : 'Add Color'
                        : activeTab === 'sizes'
                            ? editingItem ? 'Edit Size' : 'Add Size'
                            : editingItem ? 'Edit Delivery Location' : 'Add Delivery Location'
                }
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={(e: any) => {
                                if (activeTab === 'colors') handleColorSubmit(e);
                                else if (activeTab === 'sizes') handleSizeSubmit(e);
                                else handleLocationSubmit(e);
                            }}
                        >
                            {editingItem ? 'Update' : 'Create'}
                        </button>
                    </>
                }
            >
                {activeTab === 'colors' && (
                    <form onSubmit={handleColorSubmit}>
                        <div className="form-group">
                            <label htmlFor="color-name">Color Name</label>
                            <input
                                type="text"
                                id="color-name"
                                required
                                value={colorForm.name}
                                onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="color-hex">Hex Code</label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <input
                                    type="color"
                                    id="color-hex"
                                    value={colorForm.hex_code}
                                    onChange={(e) => setColorForm({ ...colorForm, hex_code: e.target.value })}
                                    style={{ width: '60px', height: '42px', padding: '4px' }}
                                />
                                <input
                                    type="text"
                                    value={colorForm.hex_code}
                                    onChange={(e) => setColorForm({ ...colorForm, hex_code: e.target.value })}
                                    placeholder="#000000"
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>
                    </form>
                )}

                {activeTab === 'sizes' && (
                    <form onSubmit={handleSizeSubmit}>
                        <div className="form-group">
                            <label htmlFor="size-name">Size Name</label>
                            <input
                                type="text"
                                id="size-name"
                                required
                                value={sizeForm.name}
                                onChange={(e) => setSizeForm({ ...sizeForm, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="size-abbr">Abbreviation</label>
                            <input
                                type="text"
                                id="size-abbr"
                                required
                                value={sizeForm.abbreviation}
                                onChange={(e) => setSizeForm({ ...sizeForm, abbreviation: e.target.value })}
                                placeholder="e.g., S, M, L, XL"
                            />
                        </div>
                    </form>
                )}

                {activeTab === 'locations' && (
                    <form onSubmit={handleLocationSubmit}>
                        <div className="form-group">
                            <label htmlFor="location-name">Location Name</label>
                            <input
                                type="text"
                                id="location-name"
                                required
                                value={locationForm.name}
                                onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location-price">Delivery Price</label>
                            <input
                                type="number"
                                id="location-price"
                                step="0.01"
                                min="0"
                                required
                                value={locationForm.price}
                                onChange={(e) => setLocationForm({ ...locationForm, price: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={locationForm.is_active}
                                    onChange={(e) => setLocationForm({ ...locationForm, is_active: e.target.checked })}
                                />
                                Active
                            </label>
                        </div>
                    </form>
                )}
            </AdminModal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title={`Delete ${activeTab === 'colors' ? 'Color' : activeTab === 'sizes' ? 'Size' : 'Delivery Location'}`}
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
            />
        </AdminLayout>
    );
};

export default AdminUtilities;
