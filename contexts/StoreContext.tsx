import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, StoreContextType, ProductVariant } from '../types';
import * as Storage from '../services/storage';
import { fetchProducts, createOrder } from '../services/api';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      console.log('🔍 Fetching products from backend...');
      console.log('📡 API URL:', import.meta.env.VITE_API_URL || 'https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1');

      // Try fetching from Django backend
      try {
        const backendProducts = await fetchProducts();
        console.log('📦 Backend products received:', backendProducts.length, 'products');

        // If we successfully fetched (even if empty), use backend data
        // This prevents showing old local mock data when we actually have a fresh empty database
        setProducts(backendProducts);
        setIsBackendConnected(true);

        if (backendProducts.length === 0) {
          console.warn('⚠️ Backend connected but returned 0 products. Add products via Dashboard!');
        }
      } catch (error) {
        console.error("❌ Backend fetch failed, falling back to local storage", error);

        // Fallback to Local Mock Data ONLY if backend fails
        const localProducts = Storage.getProducts();
        if (localProducts.length > 0) {
          console.log('📦 Using local storage products as fallback');
          setProducts(localProducts);
        }
      }

      // Orders are still local for the user's view unless we implement a user profile with order history
      setOrders(Storage.getOrders());
    };

    loadData();
  }, []);

  const addProduct = (product: Product) => {
    // Only allow adding to local state/storage
    // In a real app, this would be done via the Admin Dashboard
    const updated = [product, ...products];
    setProducts(updated);
    if (!isBackendConnected) {
      Storage.saveProducts(updated);
    }
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      // Check if this specific variant is already in cart
      const existing = prev.find((item) => item.variantId === variant.id);

      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, {
        ...product,
        quantity: quantity,
        variantId: variant.id,
        variantTitle: variant.title,
        variantPrice: variant.price
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => setCart([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const placeOrder = async (customer: { name: string; email: string; phone: string; address: string }) => {
    if (isBackendConnected) {
      // Create order in backend
      // If this fails, it will throw an error which should be caught by the caller
      await createOrder(cart, customer);
      clearCart();

      // Refresh products to get updated stock
      try {
        const updatedProducts = await fetchProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Failed to refresh products after order:', error);
      }
      return;
    }

    // Default / Fallback Local Order Logic
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + item.variantPrice * item.quantity, 0),
      status: 'pending',
      date: new Date().toISOString(),
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    Storage.saveOrders(updatedOrders);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    Storage.saveOrders(updated);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        addProduct,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
