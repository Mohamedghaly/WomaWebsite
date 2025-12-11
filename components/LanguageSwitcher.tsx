
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
        // While i18next handles internal state, updating correct dir attribute 
        // usually happens in a global effect, but we can do it here mainly or relies on App.tsx
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
            aria-label="Toggle Language"
        >
            <Globe size={14} />
            <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;
