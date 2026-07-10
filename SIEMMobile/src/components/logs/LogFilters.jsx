import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { getLogLevelLabel } from '../../localization/labels';

export default function LogFilters({ filters, onChange, onApply, onClear, loading, isLandscape }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);
  const levelOptions = [
    { value: '', label: i18n.t('commonAll') },
    ...['info', 'warn', 'error', 'critical'].map((value) => ({
      value,
      label: getLogLevelLabel(value),
    })),
  ];

  const updateFilter = (name, value) => {
    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('logFiltersTitle')}</Text>
      <View style={[styles.levelRow, isHebrew && styles.rowRtl]}>
        {levelOptions.map((option) => (
          <Text
            key={option.value || 'all'}
            style={[styles.levelButton, filters.level === option.value && styles.levelButtonActive]}
            onPress={() => updateFilter('level', option.value)}
          >
            {option.label}
          </Text>
        ))}
      </View>

      <View style={isLandscape ? styles.fieldsLandscape : styles.fieldsPortrait}>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logFilterSearch')} value={filters.q} onChangeText={(value) => updateFilter('q', value)} placeholder={i18n.t('logFilterSearchPlaceholder')} editable={!loading} />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logsSource')} value={filters.source} onChangeText={(value) => updateFilter('source', value)} placeholder={i18n.t('logFilterSourcePlaceholder')} editable={!loading} forceLtr />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logsEventType')} value={filters.eventType} onChangeText={(value) => updateFilter('eventType', value)} placeholder={i18n.t('logFilterEventTypePlaceholder')} editable={!loading} forceLtr />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logsIp')} value={filters.ip} onChangeText={(value) => updateFilter('ip', value)} placeholder={i18n.t('logFilterIpPlaceholder')} editable={!loading} forceLtr />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logsUser')} value={filters.user} onChangeText={(value) => updateFilter('user', value)} placeholder={i18n.t('logFilterUserPlaceholder')} editable={!loading} forceLtr />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logFilterFrom')} value={filters.from} onChangeText={(value) => updateFilter('from', value)} placeholder="2026-07-09T10:00:00.000Z" editable={!loading} forceLtr />
        </View>
        <View style={isLandscape ? styles.fieldLandscape : styles.fieldPortrait}>
          <AppTextInput label={i18n.t('logFilterTo')} value={filters.to} onChangeText={(value) => updateFilter('to', value)} placeholder="2026-07-09T12:00:00.000Z" editable={!loading} forceLtr />
        </View>
      </View>

      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('commonApply')} onPress={onApply} loading={loading} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('commonClear')} onPress={onClear} disabled={loading} variant="secondary" />
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
  rowRtl: {
    flexDirection: 'row-reverse',
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
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
