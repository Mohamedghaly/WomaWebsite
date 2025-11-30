import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, placeOrder } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });

  if (!isCartOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(formData);
    setFormData({ name: '', email: '', address: '' }); // Reset form data after successful order
    setIsCheckingOut(false);
    alert("Order placed successfully!"); // Keep the alert as it was in the original code
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Your Cart ({cart.length})</h2>
          <button onClick={toggleCart} className="hover:rotate-90 transition-transform duration-300">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={48} />
              <p className="font-bold uppercase tracking-widest text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.variantId}-${idx}`} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'; }}
                  className="w-20 h-24 object-cover bg-gray-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm uppercase leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.variantTitle}</p>
                    <p className="text-xs font-mono mt-1">EGP {item.variantPrice}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Qty: {item.quantity}</span>
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="text-xs font-bold uppercase text-red-500 hover:text-red-700 underline"
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
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {!isCheckingOut ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                  <span className="font-mono text-xl font-bold">
                    EGP {cart.reduce((acc, item) => acc + item.variantPrice * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Checkout Details</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                />
                <textarea
                  placeholder="Shipping Address (Street, City, Building, etc.)"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm h-24 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-1/2 border border-black py-3 font-bold uppercase text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-black text-white py-3 font-bold uppercase text-xs"
                  >
                    Confirm
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