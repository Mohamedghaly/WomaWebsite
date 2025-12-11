import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/admin/Toast';
import { adminApi, WebsiteSettings } from '../../services/admin/adminApi';
import { defaultSettings } from '../../types/settings';

const AdminWebsiteSettings: React.FC = () => {
    const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'theme' | 'content' | 'social' | 'advanced'>('branding');

    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await adminApi.getWebsiteSettings();
            setSettings({ ...defaultSettings, ...data });
        } catch (error) {
            console.error('Error loading settings:', error);
            showToast('Using default settings', 'warning');
            setSettings(defaultSettings);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminApi.updateWebsiteSettings(settings);
            showToast('Settings saved successfully! Refresh the website to see changes.', 'success');
        } catch (error: any) {
            showToast(error.detail || 'Error saving settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof WebsiteSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <AdminLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
                    <div>Loading settings...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <ToastContainer />

            <div className="page-header">
                <h1>Website Settings</h1>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', flexWrap: 'wrap' }}>
                {[
                    { id: 'branding', label: '🏷️ Branding', icon: '🏷️' },
                    { id: 'hero', label: '🎯 Hero Section', icon: '🎯' },
                    { id: 'theme', label: '🎨 Theme Colors', icon: '🎨' },
                    { id: 'content', label: '📝 Content', icon: '📝' },
                    { id: 'social', label: '🔗 Social Media', icon: '🔗' },
                    { id: 'advanced', label: '⚙️ Advanced', icon: '⚙️' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{ borderRadius: '8px 8px 0 0', fontSize: '14px' }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="card">
                <div className="card-body">
                    {/* Branding Tab */}
                    {activeTab === 'branding' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Site Branding</h2>

                            <div className="form-group">
                                <label>Site Name</label>
                                <input
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => updateField('site_name', e.target.value)}
                                    placeholder="e.g., WOMA Sportswear"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tagline</label>
                                <input
                                    type="text"
                                    value={settings.site_tagline}
                                    onChange={(e) => updateField('site_tagline', e.target.value)}
                                    placeholder="e.g., Engineered for Performance"
                                />
                            </div>

                            <div className="form-group">
                                <label>Logo URL</label>
                                <input
                                    type="url"
                                    value={settings.logo_url}
                                    onChange={(e) => updateField('logo_url', e.target.value)}
                                    placeholder="https://example.com/logo.png"
                                />
                                {settings.logo_url && (
                                    <div style={{ marginTop: '12px' }}>
                                        <img src={settings.logo_url} alt="Logo Preview" style={{ maxHeight: '80px', borderRadius: '8px', border: '2px solid #e2e8f0' }} />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Favicon URL</label>
                                <input
                                    type="url"
                                    value={settings.favicon_url || ''}
                                    onChange={(e) => updateField('favicon_url', e.target.value)}
                                    placeholder="https://example.com/favicon.ico"
                                />
                            </div>
                        </div>
                    )}

                    {/* Hero Section Tab */}
                    {activeTab === 'hero' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Hero/Banner Section</h2>

                            <div className="form-group">
                                <label>Hero Title</label>
                                <input
                                    type="text"
                                    value={settings.hero_title}
                                    onChange={(e) => updateField('hero_title', e.target.value)}
                                    placeholder="e.g., ELEVATE YOUR GAME"
                                />
                            </div>

                            <div className="form-group">
                                <label>Hero Subtitle</label>
                                <input
                                    type="text"
                                    value={settings.hero_subtitle}
                                    onChange={(e) => updateField('hero_subtitle', e.target.value)}
                                    placeholder="e.g., Premium sportswear designed for champions"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>CTA Button Text</label>
                                    <input
                                        type="text"
                                        value={settings.hero_cta_text}
                                        onChange={(e) => updateField('hero_cta_text', e.target.value)}
                                        placeholder="e.g., Shop Now"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>CTA Button Link</label>
                                    <input
                                        type="text"
                                        value={settings.hero_cta_link}
                                        onChange={(e) => updateField('hero_cta_link', e.target.value)}
                                        placeholder="e.g., /shop"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Background Image URL</label>
                                <input
                                    type="url"
                                    value={settings.hero_background_image}
                                    onChange={(e) => updateField('hero_background_image', e.target.value)}
                                    placeholder="https://example.com/hero-bg.jpg"
                                />
                                {settings.hero_background_image && (
                                    <div style={{ marginTop: '12px' }}>
                                        <img src={settings.hero_background_image} alt="Hero Preview" style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Theme Colors Tab */}
                    {activeTab === 'theme' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Theme Colors</h2>
                            <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
                                Customize the color scheme of your website. Changes will be applied site-wide.
                            </p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Primary Color</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={settings.primary_color}
                                            onChange={(e) => updateField('primary_color', e.target.value)}
                                            style={{ width: '60px', height: '42px', padding: '4px' }}
                                        />
                                        <input
                                            type="text"
                                            value={settings.primary_color}
                                            onChange={(e) => updateField('primary_color', e.target.value)}
                                            placeholder="#9333ea"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Secondary Color</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={settings.secondary_color}
                                            onChange={(e) => updateField('secondary_color', e.target.value)}
                                            style={{ width: '60px', height: '42px', padding: '4px' }}
                                        />
                                        <input
                                            type="text"
                                            value={settings.secondary_color}
                                            onChange={(e) => updateField('secondary_color', e.target.value)}
                                            placeholder="#db2777"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Accent Color</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={settings.accent_color}
                                            onChange={(e) => updateField('accent_color', e.target.value)}
                                            style={{ width: '60px', height: '42px', padding: '4px' }}
                                        />
                                        <input
                                            type="text"
                                            value={settings.accent_color}
                                            onChange={(e) => updateField('accent_color', e.target.value)}
                                            placeholder="#f472b6"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Background Color</label>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={settings.background_color}
                                            onChange={(e) => updateField('background_color', e.target.value)}
                                            style={{ width: '60px', height: '42px', padding: '4px' }}
                                        />
                                        <input
                                            type="text"
                                            value={settings.background_color}
                                            onChange={(e) => updateField('background_color', e.target.value)}
                                            placeholder="#000000"
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Text Color</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={settings.text_color}
                                        onChange={(e) => updateField('text_color', e.target.value)}
                                        style={{ width: '60px', height: '42px', padding: '4px' }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.text_color}
                                        onChange={(e) => updateField('text_color', e.target.value)}
                                        placeholder="#ffffff"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>

                            {/* Color Preview */}
                            <div style={{ marginTop: '32px', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Preview</h3>
                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: settings.primary_color, color: '#fff', fontWeight: '600' }}>
                                        Primary
                                    </div>
                                    <div style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: settings.secondary_color, color: '#fff', fontWeight: '600' }}>
                                        Secondary
                                    </div>
                                    <div style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: settings.accent_color, color: '#fff', fontWeight: '600' }}>
                                        Accent
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Content Management</h2>

                            <div className="form-group">
                                <label>About Section Title</label>
                                <input
                                    type="text"
                                    value={settings.about_title}
                                    onChange={(e) => updateField('about_title', e.target.value)}
                                    placeholder="e.g., About WOMA Sportswear"
                                />
                            </div>

                            <div className="form-group">
                                <label>About Section Description</label>
                                <textarea
                                    rows={6}
                                    value={settings.about_description}
                                    onChange={(e) => updateField('about_description', e.target.value)}
                                    placeholder="Tell your brand story..."
                                />
                            </div>

                            <div className="form-group">
                                <label>About Section Image URL</label>
                                <input
                                    type="url"
                                    value={settings.about_image || ''}
                                    onChange={(e) => updateField('about_image', e.target.value)}
                                    placeholder="https://example.com/about-image.jpg"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <input
                                        type="email"
                                        value={settings.contact_email || ''}
                                        onChange={(e) => updateField('contact_email', e.target.value)}
                                        placeholder="contact@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={settings.contact_phone || ''}
                                        onChange={(e) => updateField('contact_phone', e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Contact Address</label>
                                <textarea
                                    rows={3}
                                    value={settings.contact_address || ''}
                                    onChange={(e) => updateField('contact_address', e.target.value)}
                                    placeholder="123 Main St, City, State 12345"
                                />
                            </div>
                        </div>
                    )}

                    {/* Social Media Tab */}
                    {activeTab === 'social' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Social Media Links</h2>

                            <div className="form-group">
                                <label>📷 Instagram URL</label>
                                <input
                                    type="url"
                                    value={settings.instagram_url || ''}
                                    onChange={(e) => updateField('instagram_url', e.target.value)}
                                    placeholder="https://instagram.com/yourprofile"
                                />
                            </div>

                            <div className="form-group">
                                <label>🎵 TikTok URL</label>
                                <input
                                    type="url"
                                    value={settings.tiktok_url || ''}
                                    onChange={(e) => updateField('tiktok_url', e.target.value)}
                                    placeholder="https://tiktok.com/@yourprofile"
                                />
                            </div>

                            <div className="form-group">
                                <label>🐦 Twitter/X URL</label>
                                <input
                                    type="url"
                                    value={settings.twitter_url || ''}
                                    onChange={(e) => updateField('twitter_url', e.target.value)}
                                    placeholder="https://twitter.com/yourprofile"
                                />
                            </div>

                            <div className="form-group">
                                <label>📹 YouTube URL</label>
                                <input
                                    type="url"
                                    value={settings.youtube_url || ''}
                                    onChange={(e) => updateField('youtube_url', e.target.value)}
                                    placeholder="https://youtube.com/@yourchannel"
                                />
                            </div>
                        </div>
                    )}

                    {/* Advanced Tab */}
                    {activeTab === 'advanced' && (
                        <div>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Advanced Settings</h2>

                            <div className="form-group">
                                <label>SEO Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={settings.meta_description || ''}
                                    onChange={(e) => updateField('meta_description', e.target.value)}
                                    placeholder="A brief description for search engines (155 characters max)"
                                    maxLength={155}
                                />
                                <small style={{ color: '#64748b', fontSize: '12px' }}>
                                    {(settings.meta_description || '').length}/155 characters
                                </small>
                            </div>

                            <div className="form-group">
                                <label>SEO Keywords (comma-separated)</label>
                                <input
                                    type="text"
                                    value={settings.meta_keywords || ''}
                                    onChange={(e) => updateField('meta_keywords', e.target.value)}
                                    placeholder="sportswear, athletic wear, performance clothing"
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_newsletter}
                                        onChange={(e) => updateField('show_newsletter', e.target.checked)}
                                    />
                                    Show Newsletter Signup
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={settings.show_chat}
                                        onChange={(e) => updateField('show_chat', e.target.checked)}
                                    />
                                    Enable Live Chat Widget
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={settings.maintenance_mode}
                                        onChange={(e) => updateField('maintenance_mode', e.target.checked)}
                                    />
                                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Enable Maintenance Mode</span>
                                </label>
                                <small style={{ display: 'block', marginTop: '8px', color: '#64748b', fontSize: '12px' }}>
                                    ⚠️ When enabled, visitors will see a maintenance page. Only admins can access the site.
                                </small>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button at Bottom */}
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: '150px' }}>
                    {saving ? 'Saving...' : '💾 Save All Changes'}
                </button>
            </div>
        </AdminLayout>
    );
};

export default AdminWebsiteSettings;
