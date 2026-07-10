import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import AppTextInput from '../../src/components/common/AppTextInput';
import LanguageSwitcher from '../../src/components/common/LanguageSwitcher';
import StatusMessage from '../../src/components/common/StatusMessage';
import { useAuth } from '../../src/context/AuthContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { loginUser } from '../../src/services/authService';
import { isRequired } from '../../src/utils/validators';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { isHebrew } = useLanguage();
  const { theme } = useTheme();
  const { isLandscape } = useOrientation();
  const styles = createStyles(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!isRequired(email)) {
      setError(i18n.t('authEmailRequired'));
      return;
    }

    if (!isRequired(password)) {
      setError(i18n.t('authPasswordRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser(email.trim(), password);
      await login(data.user, data.tenant, data.token);
      router.replace('/dashboard');
    } catch (err) {
      setError(err.error || i18n.t('authLoginFailed'));
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
        <ScrollView
          contentContainerStyle={[
            styles.container,
            isLandscape
              ? styles.containerLandscape
              : styles.containerPortrait,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, isLandscape && styles.cardLandscape]}>
            <LanguageSwitcher />
            <Text style={styles.logo}>{i18n.t('authPortalName')}</Text>
            <Text style={styles.title}>{i18n.t('authLoginTitle')}</Text>
            <Text style={[styles.subtitle, isHebrew && styles.rtlText]}>{i18n.t('authLoginSubtitle')}</Text>

            <StatusMessage message={error} />

            <AppTextInput
              label={i18n.t('authEmailLabel')}
              value={email}
              onChangeText={setEmail}
              placeholder={i18n.t('authEmailPlaceholder')}
              keyboardType="email-address"
              forceLtr
              editable={!isLoading}
            />

            <AppTextInput
              label={i18n.t('authPasswordLabel')}
              value={password}
              onChangeText={setPassword}
              placeholder={i18n.t('authPasswordPlaceholder')}
              secureTextEntry
              editable={!isLoading}
            />

            <AppButton title={i18n.t('authSignIn')} onPress={handleLogin} loading={isLoading} />

            <View style={styles.footer}>
              <Text style={[styles.footerText, isHebrew && styles.rtlText]}>{i18n.t('authNoAccount')}</Text>
              <Pressable onPress={() => router.push('/register')} disabled={isLoading}>
                <Text style={[styles.link, isHebrew && styles.rtlText]}>{i18n.t('authCreateAccountLink')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  containerPortrait: {
    padding: 24,
  },
  containerLandscape: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardLandscape: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  logo: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedText,
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  footerText: {
    color: theme.mutedText,
    fontSize: 14,
  },
  link: {
    color: theme.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
