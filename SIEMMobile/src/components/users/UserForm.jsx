import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { getUserRoleLabel } from '../../localization/labels';

export default function UserForm({ email, password, role, onChangeEmail, onChangePassword, onChangeRole, onSubmit, onCancel, loading, isLandscape }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);
  const roleOptions = ['viewer', 'analyst', 'admin'].map((value) => ({
    value,
    label: getUserRoleLabel(value),
  }));

  return (
    <View style={styles.container}>
      <View style={[isLandscape ? styles.fieldsLandscape : styles.fieldsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('commonEmail')} value={email} onChangeText={onChangeEmail} placeholder="user@example.com" keyboardType="email-address" editable={!loading} forceLtr />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('commonPassword')} value={password} onChangeText={onChangePassword} placeholder={i18n.t('usersPasswordPlaceholder')} secureTextEntry editable={!loading} />
        </View>
      </View>
      <Text style={[styles.label, isHebrew && styles.rtlText]}>{i18n.t('commonRole')}</Text>
      <View style={[styles.roleRow, isHebrew && styles.rowRtl]}>
        {roleOptions.map((item) => (
          <Text
            key={item.value}
            style={[styles.roleButton, role === item.value && styles.roleButtonActive]}
            onPress={() => onChangeRole(item.value)}
          >
            {item.label}
          </Text>
        ))}
      </View>
      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('usersCreateAction')} onPress={onSubmit} loading={loading} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('commonCancel')} onPress={onCancel} disabled={loading} variant="secondary" />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  fieldsPortrait: {
    flexDirection: 'column',
  },
  fieldsLandscape: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldPortrait: {
    width: '100%',
  },
  fieldLandscape: {
    flex: 1,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roleButton: {
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    color: theme.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  roleButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    color: theme.headerText,
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
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  actionPortrait: {
    width: '100%',
  },
  actionLandscape: {
    flex: 1,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
