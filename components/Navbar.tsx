import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { cart, toggleCart } = useStore();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Mobile Menu / Left */}
          <div className="flex items-center gap-4 w-1/3">
            <button className="md:hidden">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex gap-6 text-sm font-bold tracking-tight uppercase">
              <Link to="/" className="hover:opacity-50 transition-opacity">Home</Link>
              <Link to="/shop" className="hover:opacity-50 transition-opacity">Shop</Link>
              <Link to="/about" className="hover:opacity-50 transition-opacity">About</Link>
            </div>
          </div>

          {/* Logo / Center */}
          <div className="w-1/3 flex justify-center">
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">
              WOMA<span className="text-gray-400">SPORT</span>
            </Link>
          </div>

          {/* Icons / Right */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <button className="relative" onClick={toggleCart}>
              <ShoppingBag size={24} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;