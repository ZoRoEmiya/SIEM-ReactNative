import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';

export default function LoadingBox({ message = 'Loading...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  text: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 12,
  },
});
