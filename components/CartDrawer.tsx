import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, placeOrder } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  if (!isCartOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(formData);
    setFormData({ name: '', email: '' });
    setIsCheckingOut(false);
    alert("Order placed successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tighter">Your Cart ({cart.length})</h2>
          <button onClick={toggleCart} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <span className="text-4xl">☹</span>
              <p className="uppercase font-bold text-sm tracking-widest">Cart is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-gray-100" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm uppercase leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Size: {item.size} | {item.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-sm">${item.price}</span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-[10px] uppercase underline text-gray-500 hover:text-red-500"
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
            <div className="flex justify-between items-center mb-6 text-lg font-black uppercase">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            {!isCheckingOut ? (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
              >
                Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4 animate-[fadeIn_0.3s_ease]">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
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
