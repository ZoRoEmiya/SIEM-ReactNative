import { StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';

export default function StatusMessage({ message, type = 'error' }) {
  if (!message) {
    return null;
  }

  const isError = type === 'error';

  return (
    <View style={[styles.box, isError ? styles.errorBox : styles.successBox]}>
      <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
  },
  successBox: {
    backgroundColor: '#dcfce7',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
  },
  successText: {
    color: colors.success,
  },
});
