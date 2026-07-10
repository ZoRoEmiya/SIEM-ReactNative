import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { getAlertSeverityLabel, getAlertStatusLabel } from '../../localization/labels';
import { formatDateTime } from '../../utils/formatDate';

export default function AlertCard({ alert, onPress }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.ruleName} numberOfLines={1}>
          {alert.ruleName || i18n.t('dashboardSecurityAlertFallback')}
        </Text>
        <Text style={styles.time}>{formatDateTime(alert.ts)}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {alert.description || i18n.t('dashboardNoDescription')}
      </Text>

      <View style={[styles.badgeRow, isHebrew && styles.rowRtl]}>
        <Text style={[styles.badge, styles[`severity_${alert.severity || 'low'}`]]}>{getAlertSeverityLabel(alert.severity || 'low')}</Text>
        <Text style={[styles.badge, alert.status === 'closed' ? styles.closed : styles.open]}>
          {getAlertStatusLabel(alert.status || 'open')}
        </Text>
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
    gap: 4,
    marginBottom: 8,
  },
  ruleName: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '800',
  },
  time: {
    color: theme.mutedText,
    fontSize: 12,
  },
  description: {
    color: theme.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  badge: {
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
  severity_low: {
    backgroundColor: theme.success,
  },
  severity_medium: {
    backgroundColor: '#ca8a04',
  },
  severity_high: {
    backgroundColor: '#ea580c',
  },
  severity_critical: {
    backgroundColor: theme.danger,
  },
  open: {
    backgroundColor: theme.primary,
  },
  closed: {
    backgroundColor: theme.mutedText,
  },
});
