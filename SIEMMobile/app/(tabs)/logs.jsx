import { useEffect, useState } from 'react';
import { FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import LogCard from '../../src/components/logs/LogCard';
import LogFilters from '../../src/components/logs/LogFilters';
import { useTheme } from '../../src/context/ThemeContext';
import { getLogs } from '../../src/services/logsService';
import { formatDateTime } from '../../src/utils/formatDate';

const LIMIT = 50;
const emptyFilters = {
  from: '',
  to: '',
  level: '',
  source: '',
  eventType: '',
  ip: '',
  user: '',
  q: '',
};

export default function LogsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState({ limit: LIMIT, skip: 0, total: 0 });
  const [selectedLog, setSelectedLog] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async (nextFilters = filters, skip = page.skip, showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');

    try {
      if (nextFilters.from && nextFilters.to && new Date(nextFilters.from) > new Date(nextFilters.to)) {
        setError('"From" date must be before "To" date');
        return;
      }

      const data = await getLogs({
        ...nextFilters,
        limit: LIMIT,
        skip,
      });

      setLogs(data.items || []);
      setPage(data.page || { limit: LIMIT, skip, total: 0 });
    } catch (err) {
      setError(err.error || 'Failed to load logs');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleApplyFilters = () => {
    fetchLogs(filters, 0);
  };

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    fetchLogs(emptyFilters, 0);
  };

  const handleRefresh = () => {
    fetchLogs(filters, 0, true);
  };

  const handleNextPage = () => {
    const nextSkip = page.skip + page.limit;

    if (nextSkip < page.total) {
      fetchLogs(filters, nextSkip);
    }
  };

  const handlePrevPage = () => {
    const previousSkip = Math.max(page.skip - page.limit, 0);
    fetchLogs(filters, previousSkip);
  };

  useEffect(() => {
    fetchLogs(emptyFilters, 0);
  }, []);

  if (isLoading && !logs.length) {
    return <LoadingBox message="Loading security logs..." />;
  }

  const totalPages = Math.max(Math.ceil(page.total / page.limit), 1);
  const currentPage = Math.floor(page.skip / page.limit) + 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => item._id || item.id || `log-${index}`}
        renderItem={({ item }) => <LogCard log={item} onPress={() => setSelectedLog(item)} />}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Security Logs</Text>
            <Text style={styles.subtitle}>Monitor and analyze security events.</Text>
            <StatusMessage message={error} />
            <LogFilters
              filters={filters}
              onChange={setFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              loading={isLoading}
            />
            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages} · {page.total} logs
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState title="No logs found" message="Try changing the filters or pull to refresh." />}
        ListFooterComponent={
          logs.length ? (
            <View style={styles.pagination}>
              <AppButton title="Previous" onPress={handlePrevPage} disabled={page.skip === 0 || isLoading} variant="secondary" />
              <AppButton title="Next" onPress={handleNextPage} disabled={page.skip + page.limit >= page.total || isLoading} variant="secondary" />
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

      <Modal visible={Boolean(selectedLog)} animationType="slide" onRequestClose={() => setSelectedLog()}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Log Details</Text>
            <DetailRow label="Time" value={formatDateTime(selectedLog?.ts)} />
            <DetailRow label="Level" value={selectedLog?.level} />
            <DetailRow label="Event Type" value={selectedLog?.eventType} />
            <DetailRow label="Source" value={selectedLog?.source} />
            <DetailRow label="IP" value={selectedLog?.ip || 'N/A'} />
            <DetailRow label="User" value={selectedLog?.user || 'N/A'} />
            <DetailRow label="Message" value={selectedLog?.message} />

            <Text style={styles.rawTitle}>Raw Data</Text>
            <Text style={styles.rawText}>{JSON.stringify(selectedLog?.raw || selectedLog, null, 2)}</Text>

            <AppButton title="Close" onPress={() => setSelectedLog()} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    padding: 24,
    paddingBottom: 36,
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
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: theme.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 18,
  },
  detailRow: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  detailLabel: {
    color: theme.mutedText,
    fontSize: 13,
    marginBottom: 4,
  },
  detailValue: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rawTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 8,
  },
  rawText: {
    color: theme.text,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    marginBottom: 16,
  },
});
