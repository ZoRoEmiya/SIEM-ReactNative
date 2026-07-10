import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import { useTheme } from '../../context/ThemeContext';

export default function LogFilters({ filters, onChange, onApply, onClear, loading }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const updateFilter = (name, value) => {
    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
      <View style={styles.levelRow}>
        {['', 'info', 'warn', 'error', 'critical'].map((level) => (
          <Text
            key={level || 'all'}
            style={[styles.levelButton, filters.level === level && styles.levelButtonActive]}
            onPress={() => updateFilter('level', level)}
          >
            {level || 'all'}
          </Text>
        ))}
      </View>

      <AppTextInput label="Search" value={filters.q} onChangeText={(value) => updateFilter('q', value)} placeholder="Search message" editable={!loading} />
      <AppTextInput label="Source" value={filters.source} onChangeText={(value) => updateFilter('source', value)} placeholder="Source system" editable={!loading} />
      <AppTextInput label="Event Type" value={filters.eventType} onChangeText={(value) => updateFilter('eventType', value)} placeholder="Event type" editable={!loading} />
      <AppTextInput label="IP" value={filters.ip} onChangeText={(value) => updateFilter('ip', value)} placeholder="IP address" editable={!loading} />
      <AppTextInput label="User" value={filters.user} onChangeText={(value) => updateFilter('user', value)} placeholder="Username" editable={!loading} />
      <AppTextInput label="From" value={filters.from} onChangeText={(value) => updateFilter('from', value)} placeholder="2026-07-09T10:00:00.000Z" editable={!loading} />
      <AppTextInput label="To" value={filters.to} onChangeText={(value) => updateFilter('to', value)} placeholder="2026-07-09T12:00:00.000Z" editable={!loading} />

      <View style={styles.actions}>
        <AppButton title="Apply" onPress={onApply} loading={loading} />
        <AppButton title="Clear" onPress={onClear} disabled={loading} variant="secondary" />
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  title: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  levelButton: {
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
  levelButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    color: theme.headerText,
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
});
