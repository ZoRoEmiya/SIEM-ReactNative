import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import StatusMessage from '../common/StatusMessage';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { isEmail, isPasswordLongEnough, isRequired } from '../../utils/validators';

export default function ProfileForm({ user, onUpdate, disabled, onWorkingChange }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail(user?.email || '');
  }, [user?.email]);

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    clearMessages();
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    clearMessages();
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    clearMessages();
  };

  const handleSubmit = async () => {
    if (isLoading || disabled) {
      return;
    }

    clearMessages();

    const trimmedEmail = email.trim();
    const currentEmail = user?.email || '';
    const updates = {};

    if (trimmedEmail !== currentEmail) {
      if (!isRequired(trimmedEmail)) {
        setError(i18n.t('authEmailRequired'));
        return;
      }

      if (!isEmail(trimmedEmail)) {
        setError(i18n.t('validationValidEmail'));
        return;
      }

      updates.email = trimmedEmail;
    }

    if (password) {
      if (!isPasswordLongEnough(password)) {
        setError(i18n.t('authPasswordMinimum'));
        return;
      }

      if (password !== confirmPassword) {
        setError(i18n.t('profilePasswordsMismatch'));
        return;
      }

      updates.password = password;
    } else if (confirmPassword) {
      setError(i18n.t('profilePasswordBeforeConfirmation'));
      return;
    }

    if (!Object.keys(updates).length) {
      setError(i18n.t('profileNoChanges'));
      return;
    }

    setIsLoading(true);
    onWorkingChange(true);

    try {
      const data = await onUpdate(updates);
      setEmail(data.user.email);
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage(i18n.t('profileUpdatedSuccess'));
    } catch (err) {
      setError(err.error || i18n.t('profileUpdateFailed'));
    } finally {
      setIsLoading(false);
      onWorkingChange(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('profileUpdateTitle')}</Text>
      <Text style={[styles.description, isHebrew && styles.rtlText]}>{i18n.t('profileUpdateDescription')}</Text>

      <StatusMessage message={successMessage} type="success" />
      <StatusMessage message={error} />

      <AppTextInput
        label={i18n.t('authEmailLabel')}
        value={email}
        onChangeText={handleEmailChange}
        placeholder={i18n.t('authEmailPlaceholder')}
        keyboardType="email-address"
        forceLtr
        editable={!isLoading && !disabled}
      />

      <AppTextInput
        label={i18n.t('profileNewPassword')}
        value={password}
        onChangeText={handlePasswordChange}
        placeholder={i18n.t('profileNewPasswordPlaceholder')}
        secureTextEntry
        editable={!isLoading && !disabled}
      />

      <AppTextInput
        label={i18n.t('profileConfirmPassword')}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        placeholder={i18n.t('profileConfirmPasswordPlaceholder')}
        secureTextEntry
        editable={!isLoading && !disabled}
      />

      <AppButton
        title={i18n.t('profileSaveChanges')}
        onPress={handleSubmit}
        loading={isLoading}
        disabled={disabled}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: theme.mutedText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
