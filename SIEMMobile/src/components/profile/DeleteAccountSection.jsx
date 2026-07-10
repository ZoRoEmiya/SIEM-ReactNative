import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import StatusMessage from '../common/StatusMessage';
import { useTheme } from '../../context/ThemeContext';

export default function DeleteAccountSection({ onDelete, disabled, onWorkingChange }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isDisabled = isLoading || disabled;

  const handleDelete = async () => {
    if (isDisabled) {
      return;
    }

    setIsLoading(true);
    setError('');
    onWorkingChange(true);

    try {
      await onDelete();
    } catch (err) {
      setError(err.error || 'Failed to delete account');
      setIsLoading(false);
      onWorkingChange(false);
    }
  };

  const confirmDelete = () => {
    if (isDisabled) {
      return;
    }

    setError('');
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: handleDelete,
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.warning}>
        Permanently delete your account and end this session. The final administrator in an organization cannot be deleted.
      </Text>

      <StatusMessage message={error} />

      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          isDisabled && styles.disabledButton,
          pressed && !isDisabled && styles.pressedButton,
        ]}
        onPress={confirmDelete}
        disabled={isDisabled}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.disabledText} />
        ) : (
          <Text style={[styles.deleteButtonText, isDisabled && styles.disabledButtonText]}>Delete My Account</Text>
        )}
      </Pressable>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  section: {
    backgroundColor: theme.dangerBackground,
    borderWidth: 1,
    borderColor: theme.dangerBorder,
    borderRadius: 8,
    padding: 16,
  },
  title: {
    color: theme.danger,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  warning: {
    color: theme.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.danger,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: theme.disabled,
  },
  pressedButton: {
    backgroundColor: theme.dangerPressed,
  },
  deleteButtonText: {
    color: theme.headerText,
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButtonText: {
    color: theme.disabledText,
  },
});
