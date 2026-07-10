import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import { useTheme } from '../../context/ThemeContext';
import { formatDateTime } from '../../utils/formatDate';

export default function UserCard({ item, currentUserId, onChangeRole, onDelete, loading }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
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
        <AppButton title="Delete" onPress={onDelete} disabled={isCurrentUser || loading} variant="danger" />
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
  detail: {
    color: theme.mutedText,
    fontSize: 14,
  },
  actions: {
    gap: 10,
  },
});
