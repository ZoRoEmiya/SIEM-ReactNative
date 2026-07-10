import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function AppTextInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, editable = true, forceLtr = false }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={styles.group}>
      <Text style={[styles.label, isHebrew && styles.rtlText]}>{label}</Text>
      <TextInput
        style={[styles.input, isHebrew && !forceLtr ? styles.rtlText : styles.ltrText, !editable && styles.disabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.mutedText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        editable={editable}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.inputBackground,
    color: theme.text,
    fontSize: 16,
    paddingHorizontal: 14,
  },
  disabled: {
    backgroundColor: theme.surface,
    color: theme.disabledText,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ltrText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
