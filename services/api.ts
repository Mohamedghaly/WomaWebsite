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
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
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

  // Orders (you'll need to implement this endpoint in your backend)
  async createOrder(orderData: any): Promise<any> {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

export const apiClient = new APIClient(API_BASE_URL);

// Fetch products from Django backend
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.getProducts();
    const products = response.results || response;

    if (!products || products.length === 0) {
      console.log('No products found in backend');
      return [];
    }

    return products.map((product: any) => {
      // Handle variations if they exist
      const variations = product.variations || [];
      
      // Create variants from variations
      const variants = variations.map((variation: any) => ({
        id: variation.id?.toString() || variation.sku,
        title: variation.name || `${variation.color || ''} ${variation.size || ''}`.trim(),
        price: parseFloat(variation.final_price || variation.price_adjustment || product.price),
        image: variation.images?.[0]?.image_url || product.image_url,
        selectedOptions: [
          ...(variation.color ? [{ name: 'Color', value: variation.color }] : []),
          ...(variation.size ? [{ name: 'Size', value: variation.size }] : []),
        ],
        availableForSale: (variation.stock_quantity || 0) > 0,
      }));

      // If no variations, create a default variant
      if (variants.length === 0) {
        variants.push({
          id: product.id?.toString() || 'default',
          title: 'Default',
          price: parseFloat(product.price),
          image: product.image_url,
          selectedOptions: [],
          availableForSale: (product.stock_quantity || 0) > 0,
        });
      }

      // Extract unique options from variations
      const options: any[] = [];
      const colors = [...new Set(variations.map((v: any) => v.color).filter(Boolean))];
      const sizes = [...new Set(variations.map((v: any) => v.size).filter(Boolean))];
      
      if (colors.length > 0) {
        options.push({ name: 'Color', values: colors });
      }
      if (sizes.length > 0) {
        options.push({ name: 'Size', values: sizes });
      }

      return {
        id: product.id?.toString() || product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image_url || 'https://via.placeholder.com/800x1000?text=No+Image',
        description: product.description || 'No description available.',
        category: product.category_name || product.category || 'Uncategorized',
        isNew: product.is_active !== false,
        options: options,
        variants: variants,
      };
    });
  } catch (error) {
    console.error('Failed to fetch products from backend:', error);
    return [];
  }
};

// Fetch categories from Django backend
export const fetchCategories = async (): Promise<any[]> => {
  try {
    const response = await apiClient.getCategories();
    return response.results || response;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

// Create order in Django backend
export const createOrder = async (cartItems: CartItem[], customer: { name: string; email: string }): Promise<any> => {
  try {
    // Transform cart items to match your backend's expected format
    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      items: cartItems.map(item => ({
        product_id: item.id,
        variation_id: item.variantId !== 'default' ? item.variantId : null,
        quantity: item.quantity,
        price: item.variantPrice,
      })),
      total: cartItems.reduce((acc, item) => acc + item.variantPrice * item.quantity, 0),
    };

    const response = await apiClient.createOrder(orderData);
    return response;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

// Legacy function for compatibility
export const createCheckout = async (cartItems: CartItem[]): Promise<string | null> => {
  try {
    // For now, return null - orders will be created via placeOrder in StoreContext
    console.log('Checkout with items:', cartItems);
    return null;
  } catch (error) {
    console.error('Checkout creation failed:', error);
    return null;
  }
};
