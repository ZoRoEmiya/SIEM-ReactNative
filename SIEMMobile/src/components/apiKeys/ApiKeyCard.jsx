import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import colors from '../../styles/colors';
import { formatDateTime } from '../../utils/formatDate';

export default function ApiKeyCard({ item, onRevoke, loading }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.status, item.enabled ? styles.active : styles.revoked]}>
          {item.enabled ? 'Active' : 'Revoked'}
        </Text>
      </View>
      <Text style={styles.detail}>Created: {formatDateTime(item.createdAt)}</Text>
      <Text style={styles.detail}>Last Used: {formatDateTime(item.lastUsed)}</Text>
      <AppButton title="Revoke" onPress={onRevoke} disabled={!item.enabled} loading={loading} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  status: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  active: {
    backgroundColor: colors.success,
  },
  revoked: {
    backgroundColor: colors.muted,
  },
  detail: {
    color: colors.muted,
    fontSize: 14,
  },
});
