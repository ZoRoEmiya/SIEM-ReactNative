import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function LoadingBox({ message = 'Loading...' }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.text, isHebrew && styles.rtlText]}>{message}</Text>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    padding: 24,
  },
  text: {
    color: theme.mutedText,
    fontSize: 16,
    marginTop: 12,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
