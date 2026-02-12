import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import pt from '../locales/pt.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  pt: { translation: pt }
};

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', flagUrl: 'https://flagcdn.com/w20/us.png' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', flagUrl: 'https://flagcdn.com/w20/es.png' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', flagUrl: 'https://flagcdn.com/w20/fr.png' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', flagUrl: 'https://flagcdn.com/w20/br.png' }
];

function applyDirection(langCode: string) {
  document.documentElement.dir = 'ltr';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })
  .then(() => {
    applyDirection(i18n.language);
  });

i18n.on('languageChanged', (lng: string) => {
  applyDirection(lng);
});

export default i18n;
