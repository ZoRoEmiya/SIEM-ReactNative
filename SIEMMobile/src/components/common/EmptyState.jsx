import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function EmptyState({ title, message }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isHebrew && styles.rtlText]}>{title}</Text>
      {message ? <Text style={[styles.message, isHebrew && styles.rtlText]}>{message}</Text> : null}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.card,
  },
  title: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    color: theme.mutedText,
    fontSize: 14,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
