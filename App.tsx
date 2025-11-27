import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './contexts/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      <main className={isAdminRoute ? "bg-gray-50" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<Admin />} />
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
      
      {!isAdminRoute && (
        <footer className="bg-black text-white py-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">WOMA<span className="text-gray-500">SPORT</span></h2>
                  <p className="text-gray-400 text-sm max-w-sm">
                      Reimagining sportswear through a lens of modern utility and uncompromising performance. Designed for the relentless.
                  </p>
              </div>
              <div>
                  <h3 className="font-bold uppercase tracking-widest mb-4 text-xs text-gray-500">Links</h3>
                  <ul className="space-y-2 text-sm font-bold uppercase">
                      <li><a href="#" className="hover:text-gray-400">Search</a></li>
                      <li><a href="#" className="hover:text-gray-400">Shipping</a></li>
                      <li><a href="#" className="hover:text-gray-400">Returns</a></li>
                      <li><a href="#" className="hover:text-gray-400">FAQ</a></li>
                  </ul>
              </div>
              <div>
                  <h3 className="font-bold uppercase tracking-widest mb-4 text-xs text-gray-500">Social</h3>
                  <ul className="space-y-2 text-sm font-bold uppercase">
                      <li><a href="#" className="hover:text-gray-400">Instagram</a></li>
                      <li><a href="#" className="hover:text-gray-400">TikTok</a></li>
                      <li><a href="#" className="hover:text-gray-400">Twitter</a></li>
                  </ul>
              </div>
          </div>
          <div className="text-center mt-12 text-[10px] uppercase text-gray-600 font-bold tracking-widest">
              © 2024 Woma Sportswear. All Rights Reserved.
          </div>
        </footer>
      )}
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