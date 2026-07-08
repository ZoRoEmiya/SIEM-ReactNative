import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import AppTextInput from '../../src/components/common/AppTextInput';
import StatusMessage from '../../src/components/common/StatusMessage';
import { useAuth } from '../../src/context/AuthContext';
import { loginUser } from '../../src/services/authService';
import colors from '../../src/styles/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(email.trim(), password);
      await login(data.user, data.tenant, data.token);
      router.replace('/dashboard');
    } catch (err) {
      setError(err.error || 'Login failed. Please try again.');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your security dashboard</Text>

            <StatusMessage message={error} />

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
              placeholder="Password"
              secureTextEntry
              editable={!isLoading}
            />

            <AppButton title="Sign In" onPress={handleLogin} loading={isLoading} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push('/register')} disabled={isLoading}>
                <Text style={styles.link}>Create one now</Text>
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
