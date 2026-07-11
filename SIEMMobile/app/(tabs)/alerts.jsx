import { useEffect, useState } from 'react';
import { FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import AppTextInput from '../../src/components/common/AppTextInput';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import AlertCard from '../../src/components/alerts/AlertCard';
import AlertDetails from '../../src/components/alerts/AlertDetails';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { getAlertSeverityLabel, getAlertStatusLabel } from '../../src/localization/labels';
import { getAlerts, updateAlertStatus } from '../../src/services/alertsService';

const LIMIT = 25;
const emptyFilters = {
  status: '',
  severity: '',
  q: '',
  from: '',
  to: '',
};

export default function AlertsScreen() {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const { isLandscape, width, height } = useOrientation();
  const styles = createStyles(theme);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState({ limit: LIMIT, skip: 0, total: 0 });
  const [selectedAlert, setSelectedAlert] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAlerts = async (nextFilters = filters, skip = page.skip, showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');

    try {
      if (nextFilters.from && nextFilters.to && new Date(nextFilters.from) > new Date(nextFilters.to)) {
        setError(i18n.t('alertsInvalidDateRange'));
        return;
      }

      const data = await getAlerts({
        ...nextFilters,
        limit: LIMIT,
        skip,
      });

      setAlerts(data.items || []);
      setPage(data.page || { limit: LIMIT, skip, total: 0 });
    } catch (err) {
      setError(err.error || i18n.t('alertsFailedToLoad'));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const updateFilter = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    fetchAlerts(filters, 0);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    fetchAlerts(emptyFilters, 0);
  };

  const handleToggleStatus = async () => {
    if (!selectedAlert) {
      return;
    }

    const nextStatus = selectedAlert.status === 'open' ? 'closed' : 'open';
    setUpdating(true);
    setUpdateError('');
    setSuccessMessage('');

    try {
      const data = await updateAlertStatus(selectedAlert.id, nextStatus);
      const updatedAlert = {
        ...selectedAlert,
        status: data.status,
        closedAt: data.closedAt,
        closedBy: data.closedBy,
      };

      setSelectedAlert(updatedAlert);
      setAlerts(alerts.map((alert) => (alert.id === selectedAlert.id ? updatedAlert : alert)));
      setSuccessMessage(nextStatus === 'closed' ? i18n.t('alertsClosedSuccess') : i18n.t('alertsReopenedSuccess'));
    } catch (err) {
      setUpdateError(err.error || i18n.t('alertsUpdateFailed'));
    } finally {
      setUpdating(false);
    }
  };

  const handleRefresh = () => {
    fetchAlerts(filters, 0, true);
  };

  const handleNextPage = () => {
    const nextSkip = page.skip + page.limit;

    if (nextSkip < page.total) {
      fetchAlerts(filters, nextSkip);
    }
  };

  const handlePrevPage = () => {
    const previousSkip = Math.max(page.skip - page.limit, 0);
    fetchAlerts(filters, previousSkip);
  };

  const closeDetails = () => {
    setSelectedAlert();
    setSuccessMessage('');
    setUpdateError('');
  };

  useEffect(() => {
    fetchAlerts(emptyFilters, 0);
  }, []);

  if (isLoading && !alerts.length) {
    return <LoadingBox message={i18n.t('alertsLoading')} />;
  }

  const totalPages = Math.max(Math.ceil(page.total / page.limit), 1);
  const currentPage = Math.floor(page.skip / page.limit) + 1;
  const modalDimensions = {
    width: Math.min(width, isLandscape ? 960 : width),
    minHeight: height,
  };
  const statusOptions = [
    { value: '', label: i18n.t('commonAll') },
    ...['open', 'closed'].map((value) => ({ value, label: getAlertStatusLabel(value) })),
  ];
  const severityOptions = [
    { value: '', label: i18n.t('commonAll') },
    ...['low', 'medium', 'high', 'critical'].map((value) => ({ value, label: getAlertSeverityLabel(value) })),
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => item.id || `alert-${index}`}
        renderItem={({ item }) => <AlertCard alert={item} onPress={() => setSelectedAlert(item)} />}
        contentContainerStyle={[
          styles.container,
          isLandscape
            ? styles.containerLandscape
            : styles.containerPortrait,
        ]}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('alertsTitle')}</Text>
            <Text style={[styles.subtitle, isHebrew && styles.rtlText]}>{i18n.t('alertsSubtitle')}</Text>
            <StatusMessage message={error} />

            <View style={styles.filters}>
              <Text style={[styles.filterTitle, isHebrew && styles.rtlText]}>{i18n.t('logFiltersTitle')}</Text>
              <View style={[isLandscape ? styles.filterFieldsLandscape : styles.filterFieldsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
                <View style={isLandscape ? styles.filterFieldLandscape : styles.filterFieldPortrait}>
                  <ChoiceRow
                    label={i18n.t('alertFilterStatus')}
                    value={filters.status}
                    options={statusOptions}
                    onChange={(value) => updateFilter('status', value)}
                  />
                </View>
                <View style={isLandscape ? styles.filterFieldLandscape : styles.filterFieldPortrait}>
                  <ChoiceRow
                    label={i18n.t('alertFilterSeverity')}
                    value={filters.severity}
                    options={severityOptions}
                    onChange={(value) => updateFilter('severity', value)}
                  />
                </View>
                <View style={isLandscape ? styles.filterFieldLandscape : styles.filterFieldPortrait}>
                  <AppTextInput label={i18n.t('logFilterSearch')} value={filters.q} onChangeText={(value) => updateFilter('q', value)} placeholder={i18n.t('alertFilterSearchPlaceholder')} editable={!isLoading} />
                </View>
                <View style={isLandscape ? styles.filterFieldLandscape : styles.filterFieldPortrait}>
                  <AppTextInput label={i18n.t('logFilterFrom')} value={filters.from} onChangeText={(value) => updateFilter('from', value)} placeholder="2026-07-09T10:00:00.000Z" editable={!isLoading} forceLtr />
                </View>
                <View style={isLandscape ? styles.filterFieldLandscape : styles.filterFieldPortrait}>
                  <AppTextInput label={i18n.t('logFilterTo')} value={filters.to} onChangeText={(value) => updateFilter('to', value)} placeholder="2026-07-09T12:00:00.000Z" editable={!isLoading} forceLtr />
                </View>
              </View>
              <View style={[styles.filterActions, isLandscape ? styles.filterActionsLandscape : styles.filterActionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
                <View style={isLandscape ? styles.filterActionLandscape : styles.filterActionPortrait}>
                  <AppButton title={i18n.t('commonApply')} onPress={handleApplyFilters} loading={isLoading} />
                </View>
                <View style={isLandscape ? styles.filterActionLandscape : styles.filterActionPortrait}>
                  <AppButton title={i18n.t('commonClear')} onPress={handleClearFilters} disabled={isLoading} variant="secondary" />
                </View>
              </View>
            </View>

            <Text style={[styles.pageText, isHebrew && styles.rtlText]}>
              {i18n.t('alertsPageSummary', { current: currentPage, total: totalPages, count: page.total })}
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState title={i18n.t('alertsEmptyTitle')} message={i18n.t('alertsEmptyMessage')} />}
        ListFooterComponent={
          alerts.length ? (
            <View style={styles.pagination}>
              <AppButton title={i18n.t('commonPrevious')} onPress={handlePrevPage} disabled={page.skip === 0 || isLoading} variant="secondary" />
              <AppButton title={i18n.t('commonNext')} onPress={handleNextPage} disabled={page.skip + page.limit >= page.total || isLoading} variant="secondary" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />

      <Modal visible={Boolean(selectedAlert)} animationType="slide" onRequestClose={closeDetails}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView
            contentContainerStyle={[
              styles.modalContainer,
              isLandscape
                ? styles.modalLandscape
                : styles.modalPortrait,
              modalDimensions,
            ]}
          >
            <AlertDetails
              alert={selectedAlert}
              onClose={closeDetails}
              onToggleStatus={handleToggleStatus}
              updating={updating}
              message={successMessage}
              error={updateError}
              isLandscape={isLandscape}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function ChoiceRow({ label, value, options, onChange }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={styles.choiceGroup}>
      <Text style={[styles.choiceLabel, isHebrew && styles.rtlText]}>{label}</Text>
      <View style={[styles.choiceRow, isHebrew && styles.rowRtl]}>
        {options.map((option) => (
          <Text
            key={option.value || 'all'}
            style={[styles.choiceButton, value === option.value && styles.choiceButtonActive]}
            onPress={() => onChange(option.value)}
          >
            {option.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 36,
  },
  containerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  containerLandscape: {
    maxWidth: 1100,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedText,
    marginBottom: 16,
  },
  filters: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  filterTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  choiceGroup: {
    marginBottom: 12,
  },
  choiceLabel: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  choiceButton: {
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
  choiceButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    color: theme.headerText,
  },
  filterFieldsPortrait: {
    flexDirection: 'column',
  },
  filterFieldsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterFieldPortrait: {
    width: '100%',
  },
  filterFieldLandscape: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  filterActions: {
    gap: 10,
    marginTop: 4,
  },
  filterActionsPortrait: {
    flexDirection: 'column',
  },
  filterActionsLandscape: {
    flexDirection: 'row',
  },
  filterActionPortrait: {
    width: '100%',
  },
  filterActionLandscape: {
    flex: 1,
  },
  pageText: {
    color: theme.mutedText,
    fontSize: 14,
    marginBottom: 12,
  },
  pagination: {
    gap: 10,
    marginTop: 4,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  modalContainer: {
    alignSelf: 'center',
  },
  modalPortrait: {
    width: '100%',
  },
  modalLandscape: {
    maxWidth: 960,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
