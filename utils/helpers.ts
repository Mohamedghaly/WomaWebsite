// Utility functions for common operations

/**
 * Format a date string to a localized format
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number | string): string => {
    return `$${parseFloat(amount.toString()).toFixed(2)}`;
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (string: string): boolean => {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
};

/**
 * Get API base URL based on environment
 */
export const getApiBaseUrl = (): string => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000/api/v1'
        : 'https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1';
};

/**
 * Handle array or paginated response
 */
export const normalizeApiResponse = <T>(data: T[] | { results?: T[] }): T[] => {
    return Array.isArray(data) ? data : (data as any).results || [];
};

/**
 * Capitalize first letter of a string
 */
export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate a random ID
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

/**
 * Download data as a file
 */
export const downloadFile = (data: string, filename: string, type: string = 'text/plain'): void => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
