import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { getUserRoleLabel } from '../../localization/labels';
import { formatDateTime } from '../../utils/formatDate';

export default function UserCard({ item, currentUserId, onChangeRole, onDelete, loading, isLandscape }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);
  const isCurrentUser = item.id === currentUserId;

  return (
    <View style={styles.card}>
      <View style={[styles.userHeader, isHebrew && styles.rowRtl]}>
        <Text style={styles.email}>{item.email}</Text>
        {isCurrentUser ? <Text style={[styles.you, isHebrew && styles.rtlText]}>({i18n.t('commonYou')})</Text> : null}
      </View>
      <Text style={[styles.role, isHebrew && styles.roleRtl]}>{getUserRoleLabel(item.role)}</Text>
      <View style={[styles.detailRow, isHebrew && styles.rowRtl]}>
        <Text style={[styles.detailLabel, isHebrew && styles.rtlText]}>{i18n.t('commonCreated')}</Text>
        <Text style={styles.detailValue}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('usersChangeRoleAction')} onPress={onChangeRole} disabled={isCurrentUser || loading} variant="secondary" />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('commonDelete')} onPress={onDelete} disabled={isCurrentUser || loading} variant="danger" />
        </View>
      </View>
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
  email: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '800',
    writingDirection: 'ltr',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  you: {
    color: theme.mutedText,
    fontSize: 13,
  },
  role: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.primary,
    color: theme.headerText,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  roleRtl: {
    alignSelf: 'flex-end',
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
  actions: {
    gap: 10,
  },
  actionsPortrait: {
    flexDirection: 'column',
  },
  actionsLandscape: {
    flexDirection: 'row',
  },
  actionPortrait: {
    width: '100%',
  },
  actionLandscape: {
    flex: 1,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
