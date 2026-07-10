import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatDateTime } from '../../utils/formatDate';

export default function LogCard({ log, onPress }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.headerText,
    backgroundColor: theme.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  level_info: {
    backgroundColor: theme.primary,
  },
  level_warn: {
    backgroundColor: '#ca8a04',
  },
  level_error: {
    backgroundColor: theme.danger,
  },
  level_critical: {
    backgroundColor: '#7f1d1d',
  },
  time: {
    flex: 1,
    color: theme.mutedText,
    fontSize: 12,
    textAlign: 'right',
  },
  message: {
    color: theme.text,
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
    color: theme.mutedText,
    fontSize: 13,
  },
});
