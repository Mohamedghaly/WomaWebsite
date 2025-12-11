export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  image?: string;
  selectedOptions: { name: string; value: string }[];
  availableForSale?: boolean;
  stock_quantity?: number;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isNew?: boolean;
  options?: ProductOption[];
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  variantId: string;
  variantTitle: string;
  variantPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  placeOrder: (customer: { name: string; email: string; phone: string; address: string }) => Promise<any>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}