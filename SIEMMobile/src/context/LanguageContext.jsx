import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from '../localization/i18n';

const LANGUAGE_KEY = 'siem_language';
const LanguageContext = createContext();

/**
 * Provide application language state to child components
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Nested application content
 * @returns {JSX.Element} Language context provider
 */
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(i18n.locale);

  /**
   * Restore the saved language preference when available
   * @returns {Promise<void>}
   */
  const restoreLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_KEY);

      if (savedLanguage === 'en' || savedLanguage === 'he') {
        i18n.locale = savedLanguage;
        setLanguage(savedLanguage);
      }
    } catch (error) {
      // Continue using the device language when the saved preference cannot be read.
    }
  };

  /**
   * Change the current application language
   * @param {'en'|'he'} nextLanguage - Selected application language
   * @returns {Promise<void>}
   */
  const changeLanguage = async (nextLanguage) => {
    if (nextLanguage !== 'en' && nextLanguage !== 'he') {
      return;
    }

    i18n.locale = nextLanguage;
    setLanguage(nextLanguage);

    try {
      await SecureStore.setItemAsync(LANGUAGE_KEY, nextLanguage);
    } catch (error) {
      // Keep the selected language active even when it cannot be saved.
    }
  };

  useEffect(() => {
    restoreLanguage();
  }, []);

  const value = {
    language,
    isHebrew: language === 'he',
    changeLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Access the current application language
 * @returns {{language: string, isHebrew: boolean, changeLanguage: Function}} Language context value
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageContext;
