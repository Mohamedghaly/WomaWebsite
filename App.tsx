import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './contexts/StoreContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUtilities from './pages/admin/AdminUtilities';
import AdminWebsiteSettings from './pages/admin/AdminWebsiteSettings';
import ProtectedRoute from './components/admin/ProtectedRoute';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { useTranslation } from 'react-i18next';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const { settings } = useSettings();

  const routes = (
    <>
      <ScrollToTop />

      {/* Only show public navbar for non-admin routes */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <CartDrawer />
        </>
      )}

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={
            <div className="min-h-[50vh] flex items-center justify-center bg-black text-white">
              <div className="text-center p-8">
                <h1 className="text-4xl font-black uppercase mb-4">About {settings.site_name || 'Woma Sportswear'}</h1>
                <p className="max-w-md mx-auto text-gray-400">{settings.site_tagline || 'Engineered for performance. Designed for life.'}</p>
              </div>
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin/utilities" element={
            <ProtectedRoute>
              <AdminUtilities />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminWebsiteSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 border-t border-white/10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {settings.site_name || 'WOMA'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {settings.site_tagline || t('footer.tagline')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-purple-400">{t('footer.quick_links')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.about_us')}</a></li>
                <li><a href="#shop" className="text-gray-400 hover:text-white transition-colors">{t('nav.shop')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-purple-400">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.returns')}</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} {settings.site_name || 'Woma Sportswear'}. {t('footer.rights')}
            </p>
            <h3 className="font-bold uppercase tracking-widest mb-4 text-xs text-gray-500">{t('footer.connect')}</h3>
            <ul className="space-y-3 text-sm font-semibold">
              {settings.instagram_url && (
                <li><a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:gradient-text transition-all">Instagram</a></li>
              )}
              {settings.tiktok_url && (
                <li><a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:gradient-text transition-all">TikTok</a></li>
              )}
              {settings.twitter_url && (
                <li><a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:gradient-text transition-all">Twitter</a></li>
              )}
              {settings.youtube_url && (
                <li><a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:gradient-text transition-all">YouTube</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="relative text-center mt-16 text-[10px] uppercase text-gray-600 font-bold tracking-widest">
          © {new Date().getFullYear()} {settings.site_name || 'Woma Sportswear'}. {t('footer.rights')}
        </div>
      </footer>
    </>
  );

  // Only wrap public routes with StoreProvider (cart/products)
  // Admin routes don't need it
  if (isAdminRoute) {
    return routes;
  }

  return <StoreProvider>{routes}</StoreProvider>;
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AdminAuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminAuthProvider>
    </SettingsProvider>
  );
};

export default App;