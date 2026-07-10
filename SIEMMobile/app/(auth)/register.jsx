import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import AppTextInput from '../../src/components/common/AppTextInput';
import StatusMessage from '../../src/components/common/StatusMessage';
import { useAuth } from '../../src/context/AuthContext';
import { registerUser } from '../../src/services/authService';
import colors from '../../src/styles/colors';
import { isPasswordLongEnough, isRequired } from '../../src/utils/validators';

export default function RegisterScreen() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!isRequired(companyName)) {
      setError('Company name is required');
      return;
    }

    if (!isRequired(email)) {
      setError('Email is required');
      return;
    }

    if (!isPasswordLongEnough(password)) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser(companyName.trim(), email.trim(), password);
      await login(data.user, data.tenant, data.token);
      router.replace('/dashboard');
    } catch (err) {
      setError(err.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [router, user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.logo}>SIEM Portal</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start monitoring your security today</Text>

            <StatusMessage message={error} />

            <AppTextInput
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Acme Corporation"
              editable={!isLoading}
            />

            <AppTextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="name@company.com"
              keyboardType="email-address"
              editable={!isLoading}
            />

            <AppTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
              secureTextEntry
              editable={!isLoading}
            />

            <AppButton title="Create Account" onPress={handleRegister} loading={isLoading} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => router.push('/login')} disabled={isLoading}>
                <Text style={styles.link}>Sign in instead</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logo: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
