import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import colors from '../../styles/colors';

export default function UserForm({ email, password, role, onChangeEmail, onChangePassword, onChangeRole, onSubmit, onCancel, loading }) {
  return (
    <View style={styles.container}>
      <AppTextInput label="Email" value={email} onChangeText={onChangeEmail} placeholder="user@example.com" keyboardType="email-address" editable={!loading} />
      <AppTextInput label="Password" value={password} onChangeText={onChangePassword} placeholder="At least 8 characters" secureTextEntry editable={!loading} />
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
      <View style={styles.actions}>
        <AppButton title="Create User" onPress={onSubmit} loading={loading} />
        <AppButton title="Cancel" onPress={onCancel} disabled={loading} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
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
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: '#ffffff',
  },
  actions: {
    gap: 10,
  },
});
