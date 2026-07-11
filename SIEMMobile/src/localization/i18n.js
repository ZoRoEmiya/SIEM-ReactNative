import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './languages/en.json';
import he from './languages/he.json';

const i18n = new I18n({ en, he });
const deviceLanguage = getLocales()[0]?.languageCode === 'he' ? 'he' : 'en';

i18n.locale = deviceLanguage;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
