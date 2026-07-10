import { useEffect, useState } from 'react';
import { FlatList, Modal, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import LogCard from '../../src/components/logs/LogCard';
import LogFilters from '../../src/components/logs/LogFilters';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { getLogLevelLabel } from '../../src/localization/labels';
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
  const { isHebrew } = useLanguage();
  const { isLandscape, width, height } = useOrientation();
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
        setError(i18n.t('logsInvalidDateRange'));
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
      setError(err.error || i18n.t('logsFailedToLoad'));
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
    return <LoadingBox message={i18n.t('logsLoading')} />;
  }

  const totalPages = Math.max(Math.ceil(page.total / page.limit), 1);
  const currentPage = Math.floor(page.skip / page.limit) + 1;
  const modalDimensions = {
    width: Math.min(width, isLandscape ? 960 : width),
    minHeight: height,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => item._id || item.id || `log-${index}`}
        renderItem={({ item }) => <LogCard log={item} onPress={() => setSelectedLog(item)} />}
        contentContainerStyle={[
          styles.container,
          isLandscape
            ? styles.containerLandscape
            : styles.containerPortrait,
        ]}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('logsTitle')}</Text>
            <Text style={[styles.subtitle, isHebrew && styles.rtlText]}>{i18n.t('logsSubtitle')}</Text>
            <StatusMessage message={error} />
            <LogFilters
              filters={filters}
              onChange={setFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              loading={isLoading}
              isLandscape={isLandscape}
            />
            <Text style={[styles.pageText, isHebrew && styles.rtlText]}>
              {i18n.t('logsPageSummary', { current: currentPage, total: totalPages, count: page.total })}
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState title={i18n.t('logsEmptyTitle')} message={i18n.t('logsEmptyMessage')} />}
        ListFooterComponent={
          logs.length ? (
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

      <Modal visible={Boolean(selectedLog)} animationType="slide" onRequestClose={() => setSelectedLog()}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView
            contentContainerStyle={[
              styles.modalContainer,
              isLandscape
                ? styles.modalContainerLandscape
                : styles.modalContainerPortrait,
              modalDimensions,
            ]}
          >
            <Text style={[styles.modalTitle, isHebrew && styles.rtlText]}>{i18n.t('logsDetailsTitle')}</Text>
            <View style={[isLandscape ? styles.detailsLandscape : styles.detailsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
              <DetailRow label={i18n.t('logsTime')} value={formatDateTime(selectedLog?.ts)} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
              <DetailRow label={i18n.t('logsLevel')} value={getLogLevelLabel(selectedLog?.level)} technical={false} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
              <DetailRow label={i18n.t('logsEventType')} value={selectedLog?.eventType} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
              <DetailRow label={i18n.t('logsSource')} value={selectedLog?.source} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
              <DetailRow label={i18n.t('logsIp')} value={selectedLog?.ip || i18n.t('commonNotAvailable')} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
              <DetailRow label={i18n.t('logsUser')} value={selectedLog?.user || i18n.t('commonNotAvailable')} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
              <DetailRow label={i18n.t('logsMessage')} value={selectedLog?.message} style={isLandscape ? styles.detailRowLandscape : styles.detailRowPortrait} />
            </View>

            <Text style={[styles.rawTitle, isHebrew && styles.rtlText]}>{i18n.t('logsRawData')}</Text>
            <Text style={styles.rawText}>{JSON.stringify(selectedLog?.raw || selectedLog, null, 2)}</Text>

            <AppButton title={i18n.t('commonClose')} onPress={() => setSelectedLog()} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, technical = true, style }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={[styles.detailRow, style]}>
      <Text style={[styles.detailLabel, isHebrew && styles.rtlText]}>{label}</Text>
      <Text style={[styles.detailValue, technical && value ? styles.technicalText : isHebrew && styles.rtlText]}>{value || i18n.t('commonNotAvailable')}</Text>
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
    paddingBottom: 40,
  },
  modalContainerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  modalContainerLandscape: {
    paddingHorizontal: 32,
    paddingTop: 20,
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
  },
  detailsPortrait: {
    flexDirection: 'column',
  },
  detailsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  detailRowPortrait: {
    width: '100%',
    marginBottom: 10,
  },
  detailRowLandscape: {
    flexBasis: '48%',
    flexGrow: 1,
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
    writingDirection: 'ltr',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  technicalText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
