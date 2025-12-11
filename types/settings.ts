// Website Settings Types and API

export interface WebsiteSettings {
    id?: number;

    // Branding
    site_name: string;
    site_tagline: string;
    logo_url: string;
    favicon_url?: string;

    // Hero/Banner
    hero_title: string;
    hero_subtitle: string;
    hero_cta_text: string;
    hero_cta_link: string;
    hero_background_image: string;

    // Theme Colors
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_color: string;
    text_color: string;

    // About Section
    about_title: string;
    about_description: string;
    about_image?: string;

    // Social Media
    instagram_url?: string;
    tiktok_url?: string;
    twitter_url?: string;
    youtube_url?: string;

    // Contact
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;

    // SEO
    meta_description?: string;
    meta_keywords?: string;

    // Features
    show_newsletter: boolean;
    show_chat: boolean;
    maintenance_mode: boolean;

    created_at?: string;
    updated_at?: string;
}

export const defaultSettings: WebsiteSettings = {
    site_name: 'WOMA Sportswear',
    site_tagline: 'Engineered for Performance',
    logo_url: '',

    hero_title: 'ELEVATE YOUR GAME',
    hero_subtitle: 'Premium sportswear designed for champions',
    hero_cta_text: 'Shop Now',
    hero_cta_link: '/shop',
    hero_background_image: '',

    primary_color: '#9333ea',
    secondary_color: '#db2777',
    accent_color: '#f472b6',
    background_color: '#000000',
    text_color: '#ffffff',

    about_title: 'About WOMA Sportswear',
    about_description: 'Reimagining sportswear through a lens of modern utility and uncompromising performance. Designed for the relentless.',

    show_newsletter: true,
    show_chat: false,
    maintenance_mode: false,
};
