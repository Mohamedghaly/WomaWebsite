import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { generateProductDescription } from '../services/geminiService';
import { 
  Package, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Lock, 
  LogOut, 
  ShoppingBag,
  ExternalLink,
  Settings,
  AlertTriangle,
  Cloud,
  Info
} from 'lucide-react';

const Admin: React.FC = () => {
  const { products, orders, addProduct, updateOrderStatus } = useStore();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    keywords: '', 
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if we are running on Shopify Data (heuristic: if IDs are long base64 strings)
  const isShopifyMode = products.length > 0 && products[0].id.includes('gid://');
  const shopifyAdminUrl = "https://admin.shopify.com/store/qag0f0-gq/products";

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple mock authentication
      if (credentials.username === 'admin' && credentials.password === 'salty123') {
          setIsAuthenticated(true);
          setAuthError('');
      } else {
          setAuthError('Invalid username or password');
      }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setCredentials({ username: '', password: '' });
  };

  const handleGenerateDescription = async () => {
    if (!newProduct.name || !newProduct.keywords) {
      alert("Please enter a product name and keywords/vibe to generate a description.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(newProduct.name, newProduct.category || 'Streetwear', newProduct.keywords);
    setNewProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isShopifyMode) {
        alert("Action Blocked: You are connected to Shopify. Please add products via your Shopify Admin Panel.");
        return;
    }
    addProduct({
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category || 'Uncategorized',
        image: newProduct.image || `https://picsum.photos/seed/${Math.random()}/800/1000`,
        description: newProduct.description,
        isNew: true
    });
    setNewProduct({ name: '', price: '', category: '', image: '', keywords: '', description: '' });
    alert("Product added successfully!");
  };

  // Login View
  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-800">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4 text-white">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Admin Portal</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Restricted Access</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">Username</label>
                        <input 
                            type="text"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all text-sm font-medium"
                            value={credentials.username}
                            onChange={e => setCredentials({...credentials, username: e.target.value})}
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1.5">Password</label>
                        <input 
                            type="password"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all text-sm font-medium"
                            value={credentials.password}
                            onChange={e => setCredentials({...credentials, password: e.target.value})}
                            placeholder="••••••••"
                        />
                    </div>

                    {authError && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
                            <span className="block w-2 h-2 rounded-full bg-red-600"></span>
                            {authError}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full py-3.5 bg-black text-white font-bold uppercase rounded-lg hover:bg-gray-800 transition-all shadow-lg text-sm tracking-wide"
                    >
                        Login to Dashboard
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Authorized Personnel Only</p>
                </div>
            </div>
        </div>
      );
  }

  // Authenticated Dashboard View (Sidebar Layout)
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col flex-shrink-0 transition-all duration-300">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-black italic tracking-tighter uppercase">Woma<span className="text-gray-500">Admin</span></h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Management Console</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
              <button 
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'products' ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
              >
                  <Package size={18} /> Inventory
              </button>
              <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'orders' ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
              >
                  <ShoppingBag size={18} /> 
                  <span className="flex-1 text-left">Orders</span>
                  {orders.some(o => o.status === 'pending') && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
              </button>
              <div className="pt-4 mt-4 border-t border-gray-800">
                  <a href="/" target="_blank" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
                      <ExternalLink size={18} /> Visit Store
                  </a>
              </div>
          </nav>

          <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">AD</div>
                  <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate">Admin User</p>
                      <p className="text-[10px] text-gray-500 truncate">admin@woma.com</p>
                  </div>
              </div>
              <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-gray-300 text-xs font-bold uppercase rounded-lg hover:bg-red-900/20 hover:text-red-500 transition-colors"
              >
                  <LogOut size={14} /> Logout
              </button>
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-black">
                    {activeTab === 'products' ? 'Product Management' : 'Order Fulfillment'}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                {isShopifyMode && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-[10px] font-bold uppercase text-green-700">
                        <Cloud size={12} /> Shopify Connected
                    </div>
                )}
                <button className="p-2 text-gray-400 hover:text-black transition-colors relative">
                    <Settings size={20} />
                </button>
            </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
            {activeTab === 'products' ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form */}
                    <div className={`xl:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 ${isShopifyMode ? 'opacity-90' : ''}`}>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg font-bold uppercase flex items-center gap-2">
                                <PlusCircle size={20} /> Add New Item
                            </h2>
                            {isShopifyMode && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase">Read Only</span>
                            )}
                        </div>
                        
                        {isShopifyMode && (
                            <div className="mb-8 space-y-4">
                                <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-start gap-3">
                                    <AlertTriangle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-800 uppercase mb-1">How to configure your products</h4>
                                        <p className="text-xs text-blue-600 leading-relaxed mb-3">
                                            Your store is successfully connected to Shopify. Follow these steps to make products appear:
                                        </p>
                                        <ol className="list-decimal list-inside text-xs text-blue-700 space-y-1 font-medium">
                                            <li>Click the button below to open your Shopify Admin.</li>
                                            <li>Click <strong>Add Product</strong>.</li>
                                            <li>Upload an image and set a price.</li>
                                            <li><strong>Crucial:</strong> Set Status to <span className="uppercase font-bold bg-blue-200 px-1 rounded text-[10px]">Active</span>.</li>
                                            <li><strong>Crucial:</strong> Ensure "Headless" (your app) is checked in Sales Channels.</li>
                                        </ol>
                                        <a 
                                            href={shopifyAdminUrl} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-blue-700 transition-colors"
                                        >
                                            <ExternalLink size={14} /> Open My Shopify Admin
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmitProduct} className={`space-y-6 ${isShopifyMode ? 'pointer-events-none filter grayscale-[0.5]' : ''}`}>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Product Name</label>
                                    <input 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                        required
                                        placeholder="e.g. Performance Tee"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Price (EGP)</label>
                                    <input 
                                        type="number"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                                <select 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Bottoms">Bottoms</option>
                                    <option value="Outerwear">Outerwear</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            {/* AI Section - Still usable for generating text to copy paste to shopify! */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 pointer-events-auto filter-none">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-xs font-bold uppercase text-blue-800">AI Description Generator (Copy to Shopify)</label>
                                    <Sparkles size={16} className="text-blue-600" />
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 p-3 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="Keywords (e.g. Breathable, Moisture-wicking)"
                                        value={newProduct.keywords}
                                        onChange={e => setNewProduct({...newProduct, keywords: e.target.value})}
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleGenerateDescription}
                                        disabled={isGenerating}
                                        className="px-6 py-2 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? '...' : 'Generate'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                                <textarea 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:outline-none h-32 resize-none transition-all"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isShopifyMode}
                                className="w-full py-4 bg-black text-white font-bold uppercase rounded-lg hover:bg-gray-900 transition-all shadow-lg text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isShopifyMode ? 'Use Shopify Admin to Add' : 'Publish Product'}
                            </button>
                        </form>
                    </div>

                    {/* Preview List */}
                    <div className="xl:col-span-1 space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                            <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                                <Package size={20} /> Store Inventory
                            </h2>
                            
                            {products.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl">
                                    <Info className="text-gray-300 mb-2" size={32} />
                                    <p className="text-xs font-bold text-gray-400 uppercase">No products found</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Add items in Shopify to see them here.</p>
                                </div>
                            ) : (
                                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                                    {products.slice(0, 8).map(p => (
                                        <div key={p.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md bg-gray-100" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-xs uppercase truncate">{p.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase font-bold">{p.category}</span>
                                                </div>
                                            </div>
                                            <div className="font-mono text-xs font-bold">
                                                EGP {p.price}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400">Total Products: {products.length}</p>
                            </div>
                        </div>
                    </div>
            </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="p-6">Order ID</th>
                                    <th className="p-6">Customer</th>
                                    <th className="p-6">Items</th>
                                    <th className="p-6">Total</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-16 text-center text-gray-400 font-medium">No active orders found.</td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-6 font-mono text-sm font-medium text-gray-500">#{order.id}</td>
                                            <td className="p-6">
                                                <div className="text-sm font-bold text-black">{order.customerName}</div>
                                                <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                            </td>
                                            <td className="p-6 text-sm font-medium">{order.items.length} items</td>
                                            <td className="p-6 font-mono text-sm font-bold">EGP {order.total.toFixed(2)}</td>
                                            <td className="p-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                    order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {order.status === 'delivered' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {order.status === 'pending' && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                            className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase rounded-md shadow-sm hover:bg-gray-800 transition-colors"
                                                        >
                                                            Ship
                                                        </button>
                                                    )}
                                                    {order.status === 'shipped' && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                            className="px-4 py-2 bg-green-600 text-white text-[10px] font-bold uppercase rounded-md shadow-sm hover:bg-green-700 transition-colors"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Admin;