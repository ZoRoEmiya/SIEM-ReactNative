import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import { useTheme } from '../../context/ThemeContext';
import { formatDateTime } from '../../utils/formatDate';

export default function ApiKeyCard({ item, onRevoke, loading }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
      <AppButton title="Revoke" onPress={onRevoke} disabled={!item.enabled} loading={loading} variant="danger" />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.text,
    fontSize: 17,
    fontWeight: '800',
  },
  status: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: theme.headerText,
    fontSize: 12,
    fontWeight: '800',
  },
  active: {
    backgroundColor: theme.success,
  },
  revoked: {
    backgroundColor: theme.mutedText,
  },
  detail: {
    color: theme.mutedText,
    fontSize: 14,
  },
});
