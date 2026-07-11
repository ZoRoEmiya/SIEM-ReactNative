import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteAccountSection from '../../src/components/profile/DeleteAccountSection';
import ProfileForm from '../../src/components/profile/ProfileForm';
import { useAuth } from '../../src/context/AuthContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { getUserRoleLabel } from '../../src/localization/labels';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, tenant, updateProfile, deleteAccount } = useAuth();
  const { isHebrew } = useLanguage();
  const { theme } = useTheme();
  const { isLandscape } = useOrientation();
  const styles = createStyles(theme);
  const [requestActive, setRequestActive] = useState(false);

  const handleDeleteAccount = async () => {
    await deleteAccount();
    router.replace('/login');
  };

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
          <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('profileTitle')}</Text>
          <Text style={[styles.subtitle, isHebrew && styles.rtlText]}>{i18n.t('profileSubtitle')}</Text>

          <View style={styles.detailsCard}>
            <Text style={[styles.sectionTitle, isHebrew && styles.rtlText]}>{i18n.t('profileAccountDetails')}</Text>
            <DetailRow label={i18n.t('commonEmail')} value={user?.email} technical />
            <DetailRow label={i18n.t('commonRole')} value={user?.role ? getUserRoleLabel(user.role) : undefined} translated />
            <DetailRow label={i18n.t('commonOrganization')} value={tenant?.name} />
          </View>

          <ProfileForm
            user={user}
            onUpdate={updateProfile}
            disabled={requestActive}
            onWorkingChange={setRequestActive}
          />
          <DeleteAccountSection
            onDelete={handleDeleteAccount}
            disabled={requestActive}
            onWorkingChange={setRequestActive}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, technical = false, translated = false }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, isHebrew && styles.rtlText]}>{label}</Text>
      <Text style={[
        styles.detailValue,
        technical && value && styles.technicalText,
        isHebrew && (translated || !value) && styles.rtlText,
      ]}>
        {value || i18n.t('commonNotAvailable')}
      </Text>
    </View>
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
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  containerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  containerLandscape: {
    maxWidth: 800,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    color: theme.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: theme.mutedText,
    fontSize: 16,
    marginBottom: 18,
  },
  detailsCard: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  detailRow: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingVertical: 12,
  },
  detailLabel: {
    color: theme.mutedText,
    fontSize: 13,
    marginBottom: 4,
  },
  detailValue: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  technicalText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
