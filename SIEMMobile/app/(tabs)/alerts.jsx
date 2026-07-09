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
import { getAlerts, updateAlertStatus } from '../../src/services/alertsService';
import colors from '../../src/styles/colors';

const LIMIT = 25;
const emptyFilters = {
  status: '',
  severity: '',
  q: '',
  from: '',
  to: '',
};

export default function AlertsScreen() {
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
        setError('Start date must be before end date');
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
      setError(err.error || 'Failed to load alerts');
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
      setSuccessMessage(nextStatus === 'closed' ? 'Alert closed successfully' : 'Alert reopened successfully');
    } catch (err) {
      setUpdateError(err.error || 'Failed to update alert status');
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
    return <LoadingBox message="Loading security alerts..." />;
  }

  const totalPages = Math.max(Math.ceil(page.total / page.limit), 1);
  const currentPage = Math.floor(page.skip / page.limit) + 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => item.id || `alert-${index}`}
        renderItem={({ item }) => <AlertCard alert={item} onPress={() => setSelectedAlert(item)} />}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Security Alerts</Text>
            <Text style={styles.subtitle}>Monitor critical security alerts and incidents.</Text>
            <StatusMessage message={error} />

            <View style={styles.filters}>
              <Text style={styles.filterTitle}>Filters</Text>
              <ChoiceRow
                label="Status"
                value={filters.status}
                options={['', 'open', 'closed']}
                onChange={(value) => updateFilter('status', value)}
              />
              <ChoiceRow
                label="Severity"
                value={filters.severity}
                options={['', 'low', 'medium', 'high', 'critical']}
                onChange={(value) => updateFilter('severity', value)}
              />
              <AppTextInput label="Search" value={filters.q} onChangeText={(value) => updateFilter('q', value)} placeholder="Search alerts" editable={!isLoading} />
              <AppTextInput label="From" value={filters.from} onChangeText={(value) => updateFilter('from', value)} placeholder="2026-07-09T10:00:00.000Z" editable={!isLoading} />
              <AppTextInput label="To" value={filters.to} onChangeText={(value) => updateFilter('to', value)} placeholder="2026-07-09T12:00:00.000Z" editable={!isLoading} />
              <View style={styles.filterActions}>
                <AppButton title="Apply" onPress={handleApplyFilters} loading={isLoading} />
                <AppButton title="Clear" onPress={handleClearFilters} disabled={isLoading} variant="secondary" />
              </View>
            </View>

            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages} · {page.total} alerts
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState title="No alerts found" message="Try changing the filters or pull to refresh." />}
        ListFooterComponent={
          alerts.length ? (
            <View style={styles.pagination}>
              <AppButton title="Previous" onPress={handlePrevPage} disabled={page.skip === 0 || isLoading} variant="secondary" />
              <AppButton title="Next" onPress={handleNextPage} disabled={page.skip + page.limit >= page.total || isLoading} variant="secondary" />
            </View>
          ) : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />

      <Modal visible={Boolean(selectedAlert)} animationType="slide" onRequestClose={closeDetails}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView>
            <AlertDetails
              alert={selectedAlert}
              onClose={closeDetails}
              onToggleStatus={handleToggleStatus}
              updating={updating}
              message={successMessage}
              error={updateError}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function ChoiceRow({ label, value, options, onChange }) {
  return (
    <View style={styles.choiceGroup}>
      <Text style={styles.choiceLabel}>{label}</Text>
      <View style={styles.choiceRow}>
        {options.map((option) => (
          <Text
            key={option || 'all'}
            style={[styles.choiceButton, value === option && styles.choiceButtonActive]}
            onPress={() => onChange(option)}
          >
            {option || 'all'}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 16,
  },
  filters: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  filterTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  choiceGroup: {
    marginBottom: 12,
  },
  choiceLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceButton: {
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
  },
  choiceButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: '#ffffff',
  },
  filterActions: {
    gap: 10,
    marginTop: 4,
  },
  pageText: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 12,
  },
  pagination: {
    gap: 10,
    marginTop: 4,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
