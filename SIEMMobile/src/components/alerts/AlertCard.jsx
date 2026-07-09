import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import { formatDateTime } from '../../utils/formatDate';

export default function AlertCard({ alert, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.ruleName} numberOfLines={1}>
          {alert.ruleName || 'Security Alert'}
        </Text>
        <Text style={styles.time}>{formatDateTime(alert.ts)}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {alert.description || 'No description'}
      </Text>

      <View style={styles.badgeRow}>
        <Text style={[styles.badge, styles[`severity_${alert.severity}`]]}>{alert.severity || 'low'}</Text>
        <Text style={[styles.badge, alert.status === 'closed' ? styles.closed : styles.open]}>
          {alert.status || 'open'}
        </Text>
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
    gap: 4,
    marginBottom: 8,
  },
  ruleName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  time: {
    color: colors.muted,
    fontSize: 12,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  badge: {
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
  severity_low: {
    backgroundColor: colors.success,
  },
  severity_medium: {
    backgroundColor: '#ca8a04',
  },
  severity_high: {
    backgroundColor: '#ea580c',
  },
  severity_critical: {
    backgroundColor: colors.danger,
  },
  open: {
    backgroundColor: colors.primary,
  },
  closed: {
    backgroundColor: colors.muted,
  },
});
