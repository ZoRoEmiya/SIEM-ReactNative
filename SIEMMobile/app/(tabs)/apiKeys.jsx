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
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { createApiKey, getApiKeys, revokeApiKey } from '../../src/services/apiKeysService';

export default function ApiKeysScreen() {
  const { user } = useAuth();
  const { isHebrew } = useLanguage();
  const { theme } = useTheme();
  const { isLandscape, width, height } = useOrientation();
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
  const modalDimensions = {
    width: Math.min(width, isLandscape ? 720 : width),
    minHeight: height,
  };
  const confirmDimensions = {
    width: Math.min(Math.max(width - (isLandscape ? 64 : 48), 0), 640),
  };

  const fetchKeys = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getApiKeys();
      setItems(data || []);
    } catch (err) {
      setError(err.message || err.error || i18n.t('apiKeysFailedToLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormError('');

    if (!newKeyName.trim()) {
      setFormError(i18n.t('apiKeysNameRequired'));
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
      setFormError(err.message || err.error || i18n.t('apiKeysFailedToCreate'));
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
      setError(err.message || err.error || i18n.t('apiKeysFailedToRevoke'));
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
        <View style={[styles.container, isLandscape ? styles.containerLandscape : styles.containerPortrait]}>
          <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('commonAccessDenied')}</Text>
          <Text style={[styles.text, isHebrew && styles.rtlText]}>{i18n.t('commonNoPermission')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !items.length) {
    return <LoadingBox message={i18n.t('apiKeysLoading')} />;
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
        contentContainerStyle={[
          styles.container,
          isLandscape
            ? styles.containerLandscape
            : styles.containerPortrait,
        ]}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('apiKeysTitle')}</Text>
            <Text style={[styles.text, isHebrew && styles.rtlText]}>{i18n.t('apiKeysSubtitle')}</Text>
            <StatusMessage message={error} />
            <AppButton title={i18n.t('apiKeysCreateAction')} onPress={() => setShowCreate(true)} />
          </View>
        }
        ListEmptyComponent={<EmptyState title={i18n.t('apiKeysEmptyTitle')} message={i18n.t('apiKeysEmptyMessage')} />}
      />

      <Modal visible={showCreate} animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView
            contentContainerStyle={[
              styles.modalContainer,
              isLandscape
                ? styles.modalContainerLandscape
                : styles.modalContainerPortrait,
              modalDimensions,
            ]}
          >
            <Text style={[styles.modalTitle, isHebrew && styles.rtlText]}>{i18n.t('apiKeysCreateAction')}</Text>
            <StatusMessage message={formError} />
            <ApiKeyForm
              name={newKeyName}
              onChangeName={setNewKeyName}
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
              loading={creating}
              isLandscape={isLandscape}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(rawKey)} animationType="slide" onRequestClose={() => setRawKey('')}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView
            contentContainerStyle={[
              styles.modalContainer,
              isLandscape
                ? styles.modalContainerLandscape
                : styles.modalContainerPortrait,
              modalDimensions,
            ]}
          >
            <Text style={[styles.modalTitle, isHebrew && styles.rtlText]}>{i18n.t('apiKeysCreatedTitle')}</Text>
            <Text style={[styles.warning, isHebrew && styles.rtlText]}>{i18n.t('apiKeysSaveWarning')}</Text>
            <Text style={styles.rawKey}>{rawKey}</Text>
            <AppButton title={i18n.t('apiKeysSavedAction')} onPress={() => setRawKey('')} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(keyToRevoke)} transparent animationType="fade" onRequestClose={() => setKeyToRevoke()}>
        <View style={styles.confirmOverlay}>
          <View
            style={[
              styles.confirmBox,
              isLandscape
                ? styles.confirmBoxLandscape
                : styles.confirmBoxPortrait,
              confirmDimensions,
            ]}
          >
            <Text style={[styles.confirmTitle, isHebrew && styles.rtlText]}>{i18n.t('apiKeysRevokeTitle')}</Text>
            <Text style={[styles.text, isHebrew && styles.rtlText]}>
              {i18n.t('apiKeysRevokeMessage', { name: keyToRevoke?.name })}
            </Text>
            <View style={styles.confirmActions}>
              <AppButton title={i18n.t('apiKeysRevokeAction')} onPress={handleRevoke} loading={Boolean(revokingId)} variant="danger" />
              <AppButton title={i18n.t('commonCancel')} onPress={() => setKeyToRevoke()} disabled={Boolean(revokingId)} variant="secondary" />
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
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 36,
  },
  containerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  containerLandscape: {
    maxWidth: 1000,
    paddingHorizontal: 32,
    paddingTop: 20,
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
    alignSelf: 'center',
    paddingBottom: 40,
  },
  modalContainerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  modalContainerLandscape: {
    paddingHorizontal: 32,
    paddingTop: 20,
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
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.modalBackdrop,
    padding: 24,
  },
  confirmBox: {
    alignSelf: 'center',
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 18,
  },
  confirmBoxPortrait: {
    maxWidth: 520,
  },
  confirmBoxLandscape: {
    maxWidth: 640,
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
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
