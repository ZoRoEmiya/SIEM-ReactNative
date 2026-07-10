import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function StatusMessage({ message, type = 'error' }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  if (!message) {
    return null;
  }

  const isError = type === 'error';

  return (
    <View style={[styles.box, isError ? styles.errorBox : styles.successBox]}>
      <Text style={[styles.text, isHebrew && styles.rtlText, isError ? styles.errorText : styles.successText]}>{message}</Text>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  box: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: theme.dangerBackground,
    borderColor: theme.dangerBorder,
  },
  successBox: {
    backgroundColor: theme.successBackground,
    borderColor: theme.successBorder,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: theme.danger,
  },
  successText: {
    color: theme.success,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
