import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function AppButton({ title, onPress, disabled, loading, variant = 'primary' }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && variant === 'primary' && styles.primaryPressed,
        pressed && !isDisabled && variant === 'secondary' && styles.secondaryPressed,
        pressed && !isDisabled && variant === 'danger' && styles.dangerPressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={theme.disabledText} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText, isDisabled && styles.disabledText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const createStyles = (theme) => StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  secondary: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
  },
  danger: {
    backgroundColor: theme.danger,
  },
  disabled: {
    backgroundColor: theme.disabled,
  },
  primaryPressed: {
    backgroundColor: theme.primaryPressed,
  },
  secondaryPressed: {
    backgroundColor: theme.surface,
  },
  dangerPressed: {
    backgroundColor: theme.dangerPressed,
  },
  text: {
    color: theme.headerText,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: theme.text,
  },
  disabledText: {
    color: theme.disabledText,
  },
});
