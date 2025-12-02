import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './contexts/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={
            <div className="min-h-[50vh] flex items-center justify-center bg-black text-white">
              <div className="text-center p-8">
                <h1 className="text-4xl font-black uppercase mb-4">About Woma Sportswear</h1>
                <p className="max-w-md mx-auto text-gray-400">Engineered for performance. Designed for life.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 border-t border-white/10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
              <span className="gradient-text-cyber">WOMA</span><span className="text-gray-500">SPORT</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              Reimagining sportswear through a lens of modern utility and uncompromising performance. Designed for the relentless.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="text-sm">📷</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="text-sm">🎵</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <span className="text-sm">🐦</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest mb-4 text-xs text-gray-500">Quick Links</h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li><a href="#" className="hover:gradient-text transition-all">Search</a></li>
              <li><a href="#" className="hover:gradient-text transition-all">Shipping</a></li>
              <li><a href="#" className="hover:gradient-text transition-all">Returns</a></li>
              <li><a href="#" className="hover:gradient-text transition-all">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest mb-4 text-xs text-gray-500">Connect</h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li><a href="#" className="hover:gradient-text transition-all">Instagram</a></li>
              <li><a href="#" className="hover:gradient-text transition-all">TikTok</a></li>
              <li><a href="#" className="hover:gradient-text transition-all">Twitter</a></li>
              <li><a href="#" className="hover:gradient-text transition-all">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="relative text-center mt-16 text-[10px] uppercase text-gray-600 font-bold tracking-widest">
          © 2024 Woma Sportswear. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
};

export default App;