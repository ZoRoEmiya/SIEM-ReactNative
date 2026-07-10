import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteAccountSection from '../../src/components/profile/DeleteAccountSection';
import ProfileForm from '../../src/components/profile/ProfileForm';
import { useAuth } from '../../src/context/AuthContext';
import colors from '../../src/styles/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, tenant, updateProfile, deleteAccount } = useAuth();
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
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>View and manage your account information.</Text>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <DetailRow label="Email" value={user?.email} />
            <DetailRow label="Role" value={user?.role} />
            <DetailRow label="Organization" value={tenant?.name} />
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

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
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
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginBottom: 18,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  detailRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 12,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
