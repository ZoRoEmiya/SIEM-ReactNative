import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import colors from '../../styles/colors';
import { formatDateTime } from '../../utils/formatDate';

export default function UserCard({ item, currentUserId, onChangeRole, onDelete, loading }) {
  const isCurrentUser = item.id === currentUserId;

  return (
    <View style={styles.card}>
      <Text style={styles.email}>
        {item.email}
        {isCurrentUser ? ' (You)' : ''}
      </Text>
      <Text style={styles.role}>{item.role}</Text>
      <Text style={styles.detail}>Created: {formatDateTime(item.createdAt)}</Text>
      <View style={styles.actions}>
        <AppButton title="Change Role" onPress={onChangeRole} disabled={isCurrentUser || loading} variant="secondary" />
        <AppButton title="Delete" onPress={onDelete} disabled={isCurrentUser || loading} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  email: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  role: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detail: {
    color: colors.muted,
    fontSize: 14,
  },
  actions: {
    gap: 10,
  },
});
