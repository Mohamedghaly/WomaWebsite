import { Product, CartItem } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1';

// API Client
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts(): Promise<any> {
    return this.request('/products/');
  }

  async getProduct(id: string): Promise<any> {
    return this.request(`/products/${id}/`);
  }

  // Categories
  async getCategories(): Promise<any> {
    return this.request('/categories/');
  }
}

export const apiClient = new APIClient(API_BASE_URL);

// Fetch products from Django backend
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.getProducts();
    const products = response.results || response;

    return products.map((product: any) => ({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      image: product.image_url || 'https://picsum.photos/seed/fashion/800/1000',
      description: product.description || 'No description available.',
      category: product.category_name || product.category || 'Uncategorized',
      isNew: product.is_active || false,
      options: product.variations?.map((v: any) => ({
        name: 'Variation',
        values: [v.name]
      })) || [],
      variants: product.variations?.map((v: any) => ({
        id: v.id.toString(),
        title: v.name,
        price: parseFloat(v.final_price || product.price),
        image: v.images?.[0]?.image_url || product.image_url,
        selectedOptions: [],
        availableForSale: v.stock_quantity > 0
      })) || []
    }));
  } catch (error) {
    console.error('Failed to fetch products from backend:', error);
    return [];
  }
};

// Create checkout (placeholder - implement based on your backend)
export const createCheckout = async (cartItems: CartItem[]): Promise<string | null> => {
  try {
    // TODO: Implement order creation in your Django backend
    console.log('Creating order with items:', cartItems);
    
    // For now, return null - you'll need to implement this endpoint in your backend
    return null;
  } catch (error) {
    console.error('Checkout creation failed:', error);
    return null;
  }
};
