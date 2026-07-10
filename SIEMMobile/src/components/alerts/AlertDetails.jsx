import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import StatusMessage from '../common/StatusMessage';
import colors from '../../styles/colors';
import { formatDateTime } from '../../utils/formatDate';

export default function AlertDetails({ alert, onClose, onToggleStatus, updating, message, error }) {
  if (!alert) {
    return null;
  }

  const nextStatusLabel = alert.status === 'open' ? 'Close Alert' : 'Reopen Alert';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{alert.ruleName || 'Security Alert'}</Text>
      <StatusMessage message={message} type="success" />
      <StatusMessage message={error} />

      <DetailRow label="Time" value={formatDateTime(alert.ts)} />
      <DetailRow label="Severity" value={alert.severity} />
      <DetailRow label="Status" value={alert.status} />
      <DetailRow label="Description" value={alert.description} />

      <Text style={styles.sectionTitle}>Entities</Text>
      {alert.entities && Object.keys(alert.entities).length ? (
        Object.entries(alert.entities).map(([key, value]) => (
          <DetailRow key={key} label={key} value={String(value)} />
        ))
      ) : (
        <Text style={styles.emptyText}>No entities associated with this alert.</Text>
      )}

      <View style={styles.actions}>
        <AppButton title={nextStatusLabel} onPress={onToggleStatus} loading={updating} />
        <AppButton title="Close" onPress={onClose} disabled={updating} variant="secondary" />
      </View>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  row: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 16,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
});
