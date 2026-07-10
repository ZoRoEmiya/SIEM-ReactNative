import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import { useTheme } from '../../context/ThemeContext';

export default function UserForm({ email, password, role, onChangeEmail, onChangePassword, onChangeRole, onSubmit, onCancel, loading, isLandscape }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={isLandscape ? styles.fieldsLandscape : styles.fieldsPortrait}>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="Email" value={email} onChangeText={onChangeEmail} placeholder="user@example.com" keyboardType="email-address" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="Password" value={password} onChangeText={onChangePassword} placeholder="At least 8 characters" secureTextEntry editable={!loading} />
        </View>
      </View>
      <Text style={styles.label}>Role</Text>
      <View style={styles.roleRow}>
        {['viewer', 'analyst', 'admin'].map((item) => (
          <Text
            key={item}
            style={[styles.roleButton, role === item && styles.roleButtonActive]}
            onPress={() => onChangeRole(item)}
          >
            {item}
          </Text>
        ))}
      </View>
      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Create User" onPress={onSubmit} loading={loading} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Cancel" onPress={onCancel} disabled={loading} variant="secondary" />
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
  actionPortrait: {
    width: '100%',
  },
  actionLandscape: {
    flex: 1,
  },
});
