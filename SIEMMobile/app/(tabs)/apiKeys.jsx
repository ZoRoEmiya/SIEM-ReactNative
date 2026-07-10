import { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import ApiKeyCard from '../../src/components/apiKeys/ApiKeyCard';
import ApiKeyForm from '../../src/components/apiKeys/ApiKeyForm';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { createApiKey, getApiKeys, revokeApiKey } from '../../src/services/apiKeysService';

export default function ApiKeysScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [items, setItems] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [rawKey, setRawKey] = useState('');
  const [keyToRevoke, setKeyToRevoke] = useState();
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [revokingId, setRevokingId] = useState();
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const isAdmin = user?.role === 'admin';

  const fetchKeys = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getApiKeys();
      setItems(data || []);
    } catch (err) {
      setError(err.message || err.error || 'Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormError('');

    if (!newKeyName.trim()) {
      setFormError('Name is required');
      return;
    }

    setCreating(true);

    try {
      const data = await createApiKey(newKeyName.trim());
      setRawKey(data.rawKey);
      setShowCreate(false);
      setNewKeyName('');
      await fetchKeys();
    } catch (err) {
      setFormError(err.message || err.error || 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!keyToRevoke) {
      return;
    }

    setRevokingId(keyToRevoke.id);
    setError('');

    try {
      await revokeApiKey(keyToRevoke.id);
      setItems(items.map((item) => (item.id === keyToRevoke.id ? { ...item, enabled: false } : item)));
      setKeyToRevoke();
    } catch (err) {
      setError(err.message || err.error || 'Failed to revoke API key');
    } finally {
      setRevokingId();
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchKeys();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Access Denied</Text>
          <Text style={styles.text}>You don't have permission to view this page.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !items.length) {
    return <LoadingBox message="Loading API keys..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.id || `api-key-${index}`}
        renderItem={({ item }) => (
          <ApiKeyCard
            item={item}
            onRevoke={() => setKeyToRevoke(item)}
            loading={revokingId === item.id}
          />
        )}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>API Key Management</Text>
            <Text style={styles.text}>Manage ingest API keys.</Text>
            <StatusMessage message={error} />
            <AppButton title="Create API Key" onPress={() => setShowCreate(true)} />
          </View>
        }
        ListEmptyComponent={<EmptyState title="No API keys yet" message="Create one to start ingesting logs." />}
      />

      <Modal visible={showCreate} animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create API Key</Text>
            <StatusMessage message={formError} />
            <ApiKeyForm
              name={newKeyName}
              onChangeName={setNewKeyName}
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
              loading={creating}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(rawKey)} animationType="slide" onRequestClose={() => setRawKey('')}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>API Key Created</Text>
            <Text style={styles.warning}>Save this key now. You will not see it again.</Text>
            <Text style={styles.rawKey}>{rawKey}</Text>
            <AppButton title="I've Saved the Key" onPress={() => setRawKey('')} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(keyToRevoke)} transparent animationType="fade" onRequestClose={() => setKeyToRevoke()}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Revoke API Key</Text>
            <Text style={styles.text}>Revoke {keyToRevoke?.name}? Ingest will stop for systems using this key.</Text>
            <View style={styles.confirmActions}>
              <AppButton title="Revoke" onPress={handleRevoke} loading={Boolean(revokingId)} variant="danger" />
              <AppButton title="Cancel" onPress={() => setKeyToRevoke()} disabled={Boolean(revokingId)} variant="secondary" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: theme.mutedText,
    marginBottom: 16,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  modalContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  warning: {
    color: theme.danger,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  rawKey: {
    color: theme.text,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 13,
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.modalBackdrop,
    padding: 24,
  },
  confirmBox: {
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 18,
  },
  confirmTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  confirmActions: {
    gap: 10,
    marginTop: 14,
  },
});
