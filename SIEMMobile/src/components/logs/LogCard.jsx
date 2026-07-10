import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { getLogLevelLabel } from '../../localization/labels';
import { formatDateTime } from '../../utils/formatDate';

export default function LogCard({ log, onPress }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.header, isHebrew && styles.rowRtl]}>
        <Text style={[styles.level, styles[`level_${log.level}`]]}>{getLogLevelLabel(log.level || 'info')}</Text>
        <Text style={styles.time}>{formatDateTime(log.ts)}</Text>
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {log.message || i18n.t('logsNoMessage')}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{log.eventType || i18n.t('logsEventFallback')}</Text>
        <Text style={styles.meta}>{log.source || i18n.t('logsSourceFallback')}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{log.ip || i18n.t('logsNoIp')}</Text>
        <Text style={styles.meta}>{log.user || i18n.t('logsNoUser')}</Text>
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
  rowRtl: {
    flexDirection: 'row-reverse',
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
    writingDirection: 'ltr',
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
