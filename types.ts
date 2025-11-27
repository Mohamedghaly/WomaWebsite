export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
}

export interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addProduct: (product: Product) => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  placeOrder: (customer: { name: string; email: string }) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}
