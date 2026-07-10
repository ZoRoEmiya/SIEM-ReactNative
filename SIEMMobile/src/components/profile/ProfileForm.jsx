import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import StatusMessage from '../common/StatusMessage';
import colors from '../../styles/colors';
import { isEmail, isPasswordLongEnough, isRequired } from '../../utils/validators';

export default function ProfileForm({ user, onUpdate, disabled, onWorkingChange }) {
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
        setError('Email is required');
        return;
      }

      if (!isEmail(trimmedEmail)) {
        setError('Please provide a valid email address');
        return;
      }

      updates.email = trimmedEmail;
    }

    if (password) {
      if (!isPasswordLongEnough(password)) {
        setError('Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      updates.password = password;
    } else if (confirmPassword) {
      setError('Enter a new password before confirming it');
      return;
    }

    if (!Object.keys(updates).length) {
      setError('No profile changes to save');
      return;
    }

    setIsLoading(true);
    onWorkingChange(true);

    try {
      const data = await onUpdate(updates);
      setEmail(data.user.email);
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
      onWorkingChange(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Update Profile</Text>
      <Text style={styles.description}>Change your email or set a new password.</Text>

      <StatusMessage message={successMessage} type="success" />
      <StatusMessage message={error} />

      <AppTextInput
        label="Email Address"
        value={email}
        onChangeText={handleEmailChange}
        placeholder="name@company.com"
        keyboardType="email-address"
        editable={!isLoading && !disabled}
      />

      <AppTextInput
        label="New Password"
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="Leave blank to keep current password"
        secureTextEntry
        editable={!isLoading && !disabled}
      />

      <AppTextInput
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        placeholder="Repeat new password"
        secureTextEntry
        editable={!isLoading && !disabled}
      />

      <AppButton
        title="Save Changes"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});
