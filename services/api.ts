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

        try {
          const errorJson = JSON.parse(errorText);
          // Handle DRF validation errors
          if (Array.isArray(errorJson)) {
            throw new Error(errorJson.join(', '));
          } else if (typeof errorJson === 'object') {
            // Flatten object values (e.g. {"stock": ["Not enough stock"]})
            const messages = Object.entries(errorJson)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join('\n');
            throw new Error(messages);
          }
          throw new Error(errorText);
        } catch (e) {
          // If parsing failed or it was already an error object
          if (e instanceof Error && e.message !== errorText && !e.message.includes('JSON')) throw e;
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
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

  async getProduct(idOrSlug: string): Promise<any> {
    return this.request(`/products/${idOrSlug}/`);
  }

  // Categories
  async getCategories(): Promise<any> {
    return this.request('/categories/');
  }

  // Orders
  async createOrder(orderData: any): Promise<any> {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Admin: Get all orders
  async getOrders(): Promise<any> {
    return this.request('/orders/');
  }

  // Admin: Update order status
  async patchOrderStatus(orderId: string, status: string): Promise<any> {
    return this.request(`/orders/${orderId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Admin: Create product
  async createProduct(productData: any): Promise<any> {
    return this.request('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
}

export const apiClient = new APIClient(API_BASE_URL);

// Fetch products from Django backend
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('🌐 API: Fetching products from:', API_BASE_URL);

    // 1. Get the list of products
    const response = await apiClient.getProducts();
    console.log('📡 API Response:', response);

    const productList = response.results || response;
    console.log('📋 Product list:', productList);

    if (!productList || productList.length === 0) {
      console.warn('⚠️ No products found in backend response');
      return [];
    }

    console.log(`✅ Found ${productList.length} products in backend`);

    // 2. Fetch full details for each product to get variations
    // We use Promise.all to fetch them in parallel
    const detailedProducts = await Promise.all(
      productList.map(async (item: any) => {
        try {
          // Use slug if available, otherwise ID
          const identifier = item.slug || item.id;
          return await apiClient.getProduct(identifier);
        } catch (e) {
          console.warn(`Failed to fetch details for product ${item.name}`, e);
          return item; // Fallback to list item data
        }
      })
    );

    // 3. Map the detailed data to our frontend model
    return detailedProducts.map((product: any) => {
      // Handle variations
      const variations = product.variations || [];

      // Create variants from variations
      const variants = variations.map((variation: any) => ({
        id: variation.id?.toString() || variation.sku,
        title: variation.name || variation.display_name || `${variation.attributes_display || 'Variant'}`,
        price: parseFloat(variation.final_price || variation.price_adjustment || product.price),
        image: variation.images?.[0]?.image_url || product.image_url,
        color: variation.color_hex, // Add color hex code
        selectedOptions: Object.entries(variation.attributes || {}).map(([name, value]) => ({
          name,
          value: String(value)
        })),
        availableForSale: (variation.stock_quantity || 0) > 0,
        stock_quantity: variation.stock_quantity || 0,
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

      // Filter out unavailable variants
      const availableVariants = variants.filter((v: any) => v.availableForSale);

      // Extract unique options from AVAILABLE variations
      const options: any[] = [];
      if (availableVariants.length > 0) {
        // Get all attribute keys and normalize them
        const keyMap = new Map<string, string>(); // normalized -> original (display name)

        availableVariants.forEach((v: any) => {
          v.selectedOptions.forEach((opt: any) => {
            const k = opt.name;
            const normalized = k.trim().toLowerCase();
            if (!keyMap.has(normalized)) {
              keyMap.set(normalized, k);
            } else if (k === 'Color' || k === 'Size') {
              keyMap.set(normalized, k);
            }
          });
        });

        keyMap.forEach((originalKey, normalizedKey) => {
          const values = new Set<string>();
          availableVariants.forEach((v: any) => {
            const opt = v.selectedOptions.find((o: any) => o.name.trim().toLowerCase() === normalizedKey);
            if (opt) {
              values.add(opt.value);
            }
          });
          if (values.size > 0) {
            options.push({ name: originalKey, values: Array.from(values) });
          }
        });
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
        variants: availableVariants, // Only return available variants
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
export const createOrder = async (cartItems: CartItem[], customer: { name: string; email: string; phone: string; address: string }): Promise<any> => {
  try {
    // Transform cart items to match your backend's expected format
    const orderData = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: customer.address,
      items: cartItems.map(item => ({
        product_id: item.id, // This might need to be the UUID if backend expects UUID
        variation_id: item.variantId !== 'default' && !item.variantId.includes('default') ? item.variantId : null,
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
  return null;
};

// ============================================
// ADMIN API FUNCTIONS
// ============================================

// Fetch all orders (admin)
export const fetchOrders = async (): Promise<any[]> => {
  try {
    const response = await apiClient.getOrders();
    return response.results || response;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
};

// Update order status (admin)
export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
  try {
    return await apiClient.patchOrderStatus(orderId, status);
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

// Create product (admin)
export const createProduct = async (productData: {
  name: string;
  price: number;
  category: string;
  description: string;
  image_url?: string;
}): Promise<any> => {
  try {
    return await apiClient.createProduct(productData);
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
};
