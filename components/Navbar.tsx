import React from 'react';
import { ShoppingBag, Menu } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { cart, toggleCart } = useStore();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

          {/* Mobile Menu / Left */}
          <div className="flex items-center gap-6 w-1/3">
            <button className="md:hidden hover:scale-110 transition-transform">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex gap-8 text-sm font-bold tracking-tight uppercase">
              <Link to="/" className="relative group">
                <span className="group-hover:gradient-text transition-all">Home</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/shop" className="relative group">
                <span className="group-hover:gradient-text transition-all">Shop</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/about" className="relative group">
                <span className="group-hover:gradient-text transition-all">About</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Logo / Center */}
          <div className="w-1/3 flex justify-center">
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter uppercase hover:scale-105 transition-transform">
              <span className="gradient-text">WOMA</span><span className="text-gray-400">SPORT</span>
            </Link>
          </div>

          {/* Icons / Right */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <button
              className="relative group"
              onClick={toggleCart}
            >
              <div className="group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} strokeWidth={1.5} />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold px-1.5 animate-pulse">
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