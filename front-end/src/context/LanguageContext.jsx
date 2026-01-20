import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18n } from '../data/i18n.js';

const LanguageContext = createContext();

// Valid language codes
const VALID_LANGUAGES = ['zt', 'en', 'zh', 'jp'];

// Get initial language from URL parameter or default to 'zt'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && VALID_LANGUAGES.includes(langParam)) {
      return langParam;
    }
  }
  return 'zt';
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(getInitialLanguage);

  // Update language if URL parameter changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && VALID_LANGUAGES.includes(langParam) && langParam !== currentLang) {
      setCurrentLang(langParam);
    }
  }, []);

  const t = i18n[currentLang];

  const setLanguage = (lang) => {
    if (VALID_LANGUAGES.includes(lang)) {
      setCurrentLang(lang);
      // Update URL to reflect language change (without reload)
      const url = new URL(window.location);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
