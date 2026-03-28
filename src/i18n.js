import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import teTranslations from './locales/te.json';
import hiTranslations from './locales/hi.json';
import taTranslations from './locales/ta.json';
import mlTranslations from './locales/ml.json';
import knTranslations from './locales/kn.json';

const resources = {
  en: enTranslations,
  te: teTranslations,
  hi: hiTranslations,
  ta: taTranslations,
  ml: mlTranslations,
  kn: knTranslations,
};

const getInitialLanguage = () => {
  try {
    return localStorage.getItem('selectedLanguage') || 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    parseMissingKeyHandler: (key) =>
      key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    react: {
      useSuspense: false,
    },
  });

// Persist language choice across refreshes (covers all UI entry points)
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('selectedLanguage', lng);
  } catch {}

  try {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = (lng || 'en').split('-')[0];
    }
  } catch {}
});

export default i18n;
