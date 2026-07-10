import { StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../styles/colors';

export default function AppTextInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, editable = true }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        editable={editable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
  },
  disabled: {
    backgroundColor: '#e2e8f0',
  },
});
