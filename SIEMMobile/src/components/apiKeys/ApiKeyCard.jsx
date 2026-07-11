import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { formatDateTime } from '../../utils/formatDate';

export default function ApiKeyCard({ item, onRevoke, loading }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={[styles.header, isHebrew && styles.rowRtl]}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.status, item.enabled ? styles.active : styles.revoked]}>
          {item.enabled ? i18n.t('apiKeysStatusActive') : i18n.t('apiKeysStatusRevoked')}
        </Text>
      </View>
      <View style={[styles.detailRow, isHebrew && styles.rowRtl]}>
        <Text style={[styles.detailLabel, isHebrew && styles.rtlText]}>{i18n.t('commonCreated')}</Text>
        <Text style={styles.detailValue}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <View style={[styles.detailRow, isHebrew && styles.rowRtl]}>
        <Text style={[styles.detailLabel, isHebrew && styles.rtlText]}>{i18n.t('apiKeysLastUsed')}</Text>
        <Text style={styles.detailValue}>{formatDateTime(item.lastUsed)}</Text>
      </View>
      <AppButton title={i18n.t('apiKeysRevokeAction')} onPress={onRevoke} disabled={!item.enabled} loading={loading} variant="danger" />
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
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  name: {
    flex: 1,
    color: theme.text,
    fontSize: 17,
    fontWeight: '800',
    writingDirection: 'ltr',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailLabel: {
    color: theme.mutedText,
    fontSize: 14,
  },
  detailValue: {
    color: theme.mutedText,
    fontSize: 14,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
