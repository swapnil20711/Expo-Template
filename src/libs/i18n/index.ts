import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import { ar } from './locales/ar';
import { en } from './locales/en';

// Permit right-to-left layout so Arabic can flip the UI (applied in providers via I18nManager).
I18nManager.allowRTL(true);

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
