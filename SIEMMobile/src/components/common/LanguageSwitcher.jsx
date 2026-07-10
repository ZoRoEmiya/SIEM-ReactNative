import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';

/**
 * Display controls for switching between English and Hebrew
 * @param {object} props - Component properties
 * @param {boolean} props.compact - Whether to show one compact language action
 * @returns {JSX.Element} Language selection controls
 */
export default function LanguageSwitcher({ compact = false }) {
  const { language, isHebrew, changeLanguage } = useLanguage();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (compact) {
    const nextLanguage = isHebrew ? 'en' : 'he';
    const nextLabel = isHebrew ? i18n.t('languageEnglish') : i18n.t('languageHebrew');

    return (
      <Pressable style={styles.compactButton} onPress={() => changeLanguage(nextLanguage)}>
        <Text style={[styles.compactText, { color: theme.headerText }]}>{nextLabel}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, isHebrew && styles.containerRtl]}>
      <Text style={[styles.label, isHebrew && styles.rtlText]}>{i18n.t('commonLanguage')}</Text>
      <View style={[styles.options, isHebrew && styles.optionsRtl]}>
        {['en', 'he'].map((item) => (
          <Pressable
            key={item}
            style={[styles.option, language === item && styles.optionActive]}
            onPress={() => changeLanguage(item)}
            disabled={language === item}
          >
            <Text style={[styles.optionText, language === item && styles.optionTextActive]}>
              {i18n.t(item === 'en' ? 'languageEnglish' : 'languageHebrew')}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  containerRtl: {
    alignItems: 'flex-end',
  },
  label: {
    color: theme.mutedText,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  optionsRtl: {
    flexDirection: 'row-reverse',
  },
  option: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: theme.card,
  },
  optionActive: {
    borderColor: theme.primary,
    backgroundColor: theme.primary,
  },
  optionText: {
    color: theme.text,
    fontSize: 13,
    fontWeight: '700',
  },
  optionTextActive: {
    color: theme.headerText,
  },
  compactButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  compactText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
