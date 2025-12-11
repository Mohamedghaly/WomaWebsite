// Admin API Configuration and Helper Functions

const API_BASE_URL =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000/api/v1'
        : 'https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1';

// Types
export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
}

export interface DashboardStats {
    total_products: number;
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
}

export interface Category {
    id: string; // UUID
    name: string;
    description: string;
    image?: string;
    is_active: boolean;
}

export interface Product {
    id: string; // UUID
    name: string;
    description: string;
    price: number;
    category: string; // UUID reference to Category
    category_name?: string;
    image_url?: string; // Correct field from serializer
    is_active: boolean;
    stock_quantity: number; // Base stock
    total_stock?: number; // Calculated stock
    created_at: string;
}

export interface ProductVariation {
    id: string; // UUID
    product: string; // UUID
    name: string;
    attributes: Record<string, string>; // Dynamic attributes like { "Color": "Red", "Size": "M" }
    stock_quantity: number;
    price_adjustment: number;
    is_active: boolean;
    images?: VariationImage[];
    color_hex?: string; // Read-only from serializer
    display_name?: string; // Read-only
    attributes_display?: string; // Read-only
}

export interface VariationImage {
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
}

export interface Order {
    id: number;
    user?: number;
    user_email?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    item_count?: number; // From list serializer
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    total_amount: number;
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    product: number;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
    subtotal: number;
    variation?: string; // ID
    variation_name?: string;
    variation_details?: Record<string, string>;
}

export interface Color {
    id: number;
    name: string;
    hex_code: string;
}

export interface Size {
    id: number;
    name: string;
    abbreviation: string;
}

export interface DeliveryLocation {
    id: number;
    name: string;
    price: number;
    is_active: boolean;
}

// Import WebsiteSettings from types
import { WebsiteSettings } from '../../types/settings';

// API Client Class
class AdminAPI {
    private getHeaders(skipAuth = false): HeadersInit {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(!skipAuth && token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async request<T>(endpoint: string, options: RequestInit & { skipAuth?: boolean } = {}): Promise<T> {
        const { skipAuth = false, ...fetchOptions } = options;
        const url = `${API_BASE_URL}${endpoint}`;

        const headers = {
            ...this.getHeaders(skipAuth),
            ...fetchOptions.headers,
        };

        const config: RequestInit = {
            ...fetchOptions,
            headers,
        };

        try {
            const response = await fetch(url, config);

            // Handle 204 No Content (DELETE successful)
            if (response.status === 204) {
                return null as any;
            }

            const contentType = response.headers.get('content-type');

            // If response is HTML (error page), handle it
            if (contentType?.includes('text/html')) {
                const htmlText = await response.text();
                console.error('Server returned HTML error:', htmlText.substring(0, 500));
                throw {
                    status: response.status,
                    message: `Server error (${response.status}). Check backend console.`,
                    detail: 'Server returned an error page instead of JSON.',
                };
            }

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            return data;
        } catch (error: any) {
            console.error('API Error:', error);

            // Handle 401 Unauthorized
            if (
                error.status === 401 ||
                error.detail === 'Authentication credentials were not provided.' ||
                error.code === 'token_not_valid'
            ) {
                // Only redirect if not on login page and not a login attempt
                if (!window.location.hash.includes('/admin/login') && !endpoint.includes('/auth/login/')) {
                    localStorage.clear();
                    window.location.hash = '#/admin/login';
                }
            }

            throw error;
        }
    }

    // Auth
    async login(email: string, password: string): Promise<LoginResponse> {
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true,
        });
    }

    async getProfile(): Promise<User> {
        return this.request('/auth/profile/');
    }

    // Dashboard Stats
    async getDashboardStats(): Promise<DashboardStats> {
        return this.request('/stats/');
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        return this.request('/admin/categories/');
    }

    async createCategory(data: Partial<Category>): Promise<Category> {
        return this.request('/admin/categories/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
        return this.request(`/admin/categories/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCategory(id: number): Promise<void> {
        return this.request(`/admin/categories/${id}/`, {
            method: 'DELETE',
        });
    }

    // Products
    async getProducts(params?: Record<string, string>): Promise<Product[]> {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return this.request(`/admin/products/${query}`);
    }

    async getProduct(id: string): Promise<Product> {
        return this.request(`/admin/products/${id}/`);
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        return this.request('/admin/products/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        return this.request(`/admin/products/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProduct(id: string): Promise<void> {
        return this.request(`/admin/products/${id}/`, {
            method: 'DELETE',
        });
    }

    // Variations
    async getVariations(productId: string): Promise<ProductVariation[]> {
        return this.request(`/admin/variations/?product=${productId}`);
    }

    async createVariation(data: Partial<ProductVariation>): Promise<ProductVariation> {
        return this.request('/admin/variations/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateVariation(id: string, data: Partial<ProductVariation>): Promise<ProductVariation> {
        return this.request(`/admin/variations/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteVariation(id: string): Promise<void> {
        return this.request(`/admin/variations/${id}/`, {
            method: 'DELETE',
        });
    }

    // Orders
    async getOrders(params?: Record<string, string>): Promise<Order[]> {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return this.request(`/admin/orders/${query}`);
    }

    async getOrder(id: number): Promise<Order> {
        return this.request(`/admin/orders/${id}/`);
    }

    async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
        return this.request(`/admin/orders/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    // Utilities: Colors
    async getColors(): Promise<Color[]> {
        return this.request('/colors/');
    }

    async createColor(data: Partial<Color>): Promise<Color> {
        return this.request('/colors/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateColor(id: number, data: Partial<Color>): Promise<Color> {
        return this.request(`/colors/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteColor(id: number): Promise<void> {
        return this.request(`/colors/${id}/`, {
            method: 'DELETE',
        });
    }

    // Utilities: Sizes
    async getSizes(): Promise<Size[]> {
        return this.request('/sizes/');
    }

    async createSize(data: Partial<Size>): Promise<Size> {
        return this.request('/sizes/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateSize(id: number, data: Partial<Size>): Promise<Size> {
        return this.request(`/sizes/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteSize(id: number): Promise<void> {
        return this.request(`/sizes/${id}/`, {
            method: 'DELETE',
        });
    }

    // Utilities: Delivery Locations
    async getDeliveryLocations(): Promise<DeliveryLocation[]> {
        return this.request('/delivery-locations/');
    }

    async createDeliveryLocation(data: Partial<DeliveryLocation>): Promise<DeliveryLocation> {
        return this.request('/delivery-locations/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateDeliveryLocation(id: number, data: Partial<DeliveryLocation>): Promise<DeliveryLocation> {
        return this.request(`/delivery-locations/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteDeliveryLocation(id: number): Promise<void> {
        return this.request(`/delivery-locations/${id}/`, {
            method: 'DELETE',
        });
    }

    // Website Settings
    async getWebsiteSettings(): Promise<WebsiteSettings> {
        return this.request('/admin/settings/');
    }

    async updateWebsiteSettings(data: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
        return this.request('/admin/settings/', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
}

// Export singleton instance
export const adminApi = new AdminAPI();

// Re-export WebsiteSettings for convenience
export type { WebsiteSettings } from '../../types/settings';

// Utility Functions
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function formatCurrency(amount: number | string | undefined | null): string {
    const value = amount ? parseFloat(amount.toString()) : 0;
    return `$${value.toFixed(2)}`;
}

export function checkAuth(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token && !window.location.hash.includes('/admin/login')) {
        window.location.hash = '#/admin/login';
        return false;
    }
    return true;
}

export function logout(): void {
    localStorage.clear();
    window.location.hash = '#/admin/login';
}
