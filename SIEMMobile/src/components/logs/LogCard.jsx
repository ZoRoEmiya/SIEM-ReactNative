import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import { formatDateTime } from '../../utils/formatDate';

export default function LogCard({ log, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={[styles.level, styles[`level_${log.level}`]]}>{log.level || 'info'}</Text>
        <Text style={styles.time}>{formatDateTime(log.ts)}</Text>
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {log.message || 'No message'}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{log.eventType || 'event'}</Text>
        <Text style={styles.meta}>{log.source || 'source'}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{log.ip || 'No IP'}</Text>
        <Text style={styles.meta}>{log.user || 'No user'}</Text>
      </View>
    </Pressable>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  level: {
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#ffffff',
    backgroundColor: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  level_info: {
    backgroundColor: colors.primary,
  },
  level_warn: {
    backgroundColor: '#ca8a04',
  },
  level_error: {
    backgroundColor: colors.danger,
  },
  level_critical: {
    backgroundColor: '#7f1d1d',
  },
  time: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'right',
  },
  message: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  meta: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
  },
});
