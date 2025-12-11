import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebsiteSettings, defaultSettings } from '../types/settings';

interface SettingsContextType {
    settings: WebsiteSettings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        try {
            // Try to load from backend
            const response = await fetch(
                window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:8000/api/v1/settings/'
                    : 'https://warm-hippopotamus-ghaly-fafb8bcd.koyeb.app/api/v1/settings/'
            );

            if (response.ok) {
                const data = await response.json();
                setSettings({ ...defaultSettings, ...data });

                // Apply theme colors to CSS variables
                applyThemeColors(data);
            } else {
                // Use default settings if API fails
                setSettings(defaultSettings);
                applyThemeColors(defaultSettings);
            }
        } catch (error) {
            console.error('Failed to load website settings, using defaults:', error);
            setSettings(defaultSettings);
            applyThemeColors(defaultSettings);
        } finally {
            setLoading(false);
        }
    };

    const applyThemeColors = (settings: WebsiteSettings) => {
        // Apply custom theme colors to CSS variables
        const root = document.documentElement;
        root.style.setProperty('--color-primary', settings.primary_color);
        root.style.setProperty('--color-secondary', settings.secondary_color);
        root.style.setProperty('--color-accent', settings.accent_color);
        root.style.setProperty('--color-background', settings.background_color);
        root.style.setProperty('--color-text', settings.text_color);

        // Also update the gradients based on new colors
        // Note: This is a simple approximation. For better gradients, we might need more complex logic or extra settings.
        // But for now, let's use the primary and secondary colors.
        root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${settings.primary_color} 0%, ${settings.secondary_color} 100%)`);

        // Update document title
        document.title = `${settings.site_name} | ${settings.site_tagline}`;

        // Update meta description if present
        if (settings.meta_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', settings.meta_description);
        }

        // Update favicon if present
        if (settings.favicon_url) {
            let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (!favicon) {
                favicon = document.createElement('link');
                favicon.setAttribute('rel', 'icon');
                document.head.appendChild(favicon);
            }
            favicon.href = settings.favicon_url;
        }
    };

    const refreshSettings = async () => {
        setLoading(true);
        await loadSettings();
    };

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};
