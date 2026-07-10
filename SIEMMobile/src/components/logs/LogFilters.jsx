import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import { useTheme } from '../../context/ThemeContext';

export default function LogFilters({ filters, onChange, onApply, onClear, loading, isLandscape }) {
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

      <View style={isLandscape ? styles.fieldsLandscape : styles.fieldsPortrait}>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="Search" value={filters.q} onChangeText={(value) => updateFilter('q', value)} placeholder="Search message" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="Source" value={filters.source} onChangeText={(value) => updateFilter('source', value)} placeholder="Source system" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="Event Type" value={filters.eventType} onChangeText={(value) => updateFilter('eventType', value)} placeholder="Event type" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="IP" value={filters.ip} onChangeText={(value) => updateFilter('ip', value)} placeholder="IP address" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="User" value={filters.user} onChangeText={(value) => updateFilter('user', value)} placeholder="Username" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="From" value={filters.from} onChangeText={(value) => updateFilter('from', value)} placeholder="2026-07-09T10:00:00.000Z" editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label="To" value={filters.to} onChangeText={(value) => updateFilter('to', value)} placeholder="2026-07-09T12:00:00.000Z" editable={!loading} />
        </View>
      </View>

      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Apply" onPress={onApply} loading={loading} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Clear" onPress={onClear} disabled={loading} variant="secondary" />
        </View>
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
  fieldsPortrait: {
    flexDirection: 'column',
  },
  fieldsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldPortrait: {
    width: '100%',
  },
  fieldLandscape: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  actions: {
    gap: 10,
    marginTop: 4,
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
