import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, StoreContextType, ProductVariant } from '../types';
import * as Storage from '../services/storage';
import { fetchShopifyProducts, createShopifyCheckout } from '../services/shopify';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShopifyConnected, setIsShopifyConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // 1. Try fetching from Shopify
      const shopifyProducts = await fetchShopifyProducts();
      
      if (shopifyProducts.length > 0) {
        setProducts(shopifyProducts);
        setIsShopifyConnected(true);
      } else {
        // 2. Fallback to Local Mock Data
        console.log("Using Local Storage (Shopify connection not configured or empty)");
        setProducts(Storage.getProducts());
        setIsShopifyConnected(false);
      }
      
      // Orders are still local for the Admin Dashboard demo unless we build a full backend
      setOrders(Storage.getOrders());
    };

    loadData();
  }, []);

  const addProduct = (product: Product) => {
    // Only allow adding to local state/storage. 
    // Shopify Storefront API cannot write products.
    const updated = [product, ...products];
    setProducts(updated);
    if (!isShopifyConnected) {
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
    if (isShopifyConnected) {
       // In a real Headless app, we redirect to Shopify Web Checkout here.
       const checkoutUrl = await createShopifyCheckout(cart);
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