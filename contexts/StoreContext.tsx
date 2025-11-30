import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, StoreContextType, ProductVariant } from '../types';
import * as Storage from '../services/storage';
import { fetchProducts, createCheckout } from '../services/api';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Try fetching from Django backend
      const backendProducts = await fetchProducts();
      
      if (backendProducts.length > 0) {
        setProducts(backendProducts);
        setIsBackendConnected(true);
      } else {
        // Fallback to Local Mock Data
        console.log("Using Local Storage (Backend connection not configured or empty)");
        setProducts(Storage.getProducts());
        setIsBackendConnected(false);
      }
      
      // Orders are still local for now
      setOrders(Storage.getOrders());
    };

    loadData();
  }, []);

  const addProduct = (product: Product) => {
    // Only allow adding to local state/storage
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

  const placeOrder = async (customer: { name: string; email: string }) => {
    if (isBackendConnected) {
       // Try to create checkout via backend
       const checkoutUrl = await createCheckout(cart);
       if (checkoutUrl) {
         window.location.href = checkoutUrl;
         return; 
       }
    }

    // Default / Fallback Local Order Logic
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: customer.name,
      customerEmail: customer.email,
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
