import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, placeOrder } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  if (!isCartOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await placeOrder(formData);
      setFormData({ name: '', email: '', phone: '', address: '' }); // Reset form data after successful order
      setIsCheckingOut(false);
      alert("Order placed successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to place order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col" style={{ animation: 'slideLeft 0.4s ease-out' }}>

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            <span className="gradient-text">Your Cart</span>
            <span className="text-gray-400 ml-2">({cart.length})</span>
          </h2>
          <button
            onClick={toggleCart}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-lg transition-all duration-300 hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <p className="font-bold uppercase tracking-widest text-sm">Your cart is empty</p>
              <p className="text-xs text-gray-400">Add some items to get started!</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.variantId}-${idx}`} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm uppercase leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{item.variantTitle}</p>
                    <p className="text-sm font-mono font-bold gradient-text">EGP {item.variantPrice}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full">Qty: {item.quantity}</span>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-xs font-bold uppercase text-red-500 hover:text-red-700 hover:underline transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            {!isCheckingOut ? (
              <>
                <div className="flex justify-between items-center mb-6 p-4 rounded-xl bg-white border border-gray-200">
                  <span className="font-bold uppercase tracking-widest text-sm text-gray-600">Total</span>
                  <span className="font-mono text-2xl font-black gradient-text">
                    EGP {cart.reduce((acc, item) => acc + item.variantPrice * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="group relative w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 font-bold uppercase tracking-widest hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden hover:scale-[1.02]"
                >
                  <span className="relative z-10">Checkout</span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" style={{ animation: 'slideUp 0.3s ease-out' }}>
                <h3 className="font-black uppercase tracking-widest text-base mb-6 gradient-text">Checkout Details</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm transition-all duration-300"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm transition-all duration-300"
                />
                <textarea
                  placeholder="Shipping Address (Street, City, Building, etc.)"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-sm h-28 resize-none transition-all duration-300"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-1/2 border-2 border-gray-300 py-3 font-bold uppercase text-xs rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="group relative w-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 font-bold uppercase text-xs rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105"
                  >
                    <span className="relative z-10">Confirm Order</span>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;