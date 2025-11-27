import { Product, Order } from '../types';

const PRODUCTS_KEY = 'salty_products';
const ORDERS_KEY = 'salty_orders';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'OVERSIZED ESSENTIAL TEE',
    price: 45,
    image: 'https://picsum.photos/id/100/800/1000',
    description: 'Heavyweight cotton jersey. Drop shoulder fit. The ultimate essential for your daily rotation.',
    category: 'T-Shirts',
    isNew: true,
  },
  {
    id: '2',
    name: 'UTILITY CARGO PANT',
    price: 120,
    image: 'https://picsum.photos/id/103/800/1000',
    description: 'Relaxed fit with multiple functional pockets. Constructed from durable ripstop fabric.',
    category: 'Bottoms',
  },
  {
    id: '3',
    name: 'MONOGRAM HOODIE',
    price: 95,
    image: 'https://picsum.photos/id/338/800/1000',
    description: 'French terry cotton. Embroidered tonal logo on chest. Slightly cropped boxy fit.',
    category: 'Hoodies',
    isNew: true,
  },
  {
    id: '4',
    name: 'TACTICAL VEST',
    price: 150,
    image: 'https://picsum.photos/id/204/800/1000',
    description: 'Layering piece with adjustable straps and buckle closures. Nylon blend.',
    category: 'Outerwear',
  },
  {
    id: '5',
    name: 'DISTRESSED DENIM',
    price: 110,
    image: 'https://picsum.photos/id/447/800/1000',
    description: 'Hand-distressed vintage wash. Straight leg fit with raw hem.',
    category: 'Bottoms',
  },
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};
