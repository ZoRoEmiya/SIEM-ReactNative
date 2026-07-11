import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import { useAuth } from '../../src/context/AuthContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { getAlertSeverityLabel, getAlertStatusLabel, getUserRoleLabel } from '../../src/localization/labels';
import { getStats } from '../../src/services/statsService';
import { formatDateTime } from '../../src/utils/formatDate';

export default function DashboardScreen() {
  const { isLandscape } = useOrientation();
  const { user, tenant } = useAuth();
  const { isHebrew } = useLanguage();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [stats, setStats] = useState();
  const [range, setRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async (selectedRange = range) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getStats(selectedRange);
      setStats(data);
    } catch (err) {
      setError(err.error || i18n.t('dashboardFailedToLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRangeChange = (nextRange) => {
    setRange(nextRange);
    fetchStats(nextRange);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading && !stats) {
    return <LoadingBox message={i18n.t('dashboardLoading')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isLandscape
            ? styles.containerLandscape
            : styles.containerPortrait,
        ]}
      >
        <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('dashboardTitle')}</Text>
        <Text style={styles.subtitle}>{tenant?.name || i18n.t('authPortalName')}</Text>

        <View style={[styles.infoGrid, isLandscape ? styles.cardsLandscape : styles.cardsPortrait]}>
          <InfoCard label={i18n.t('dashboardEmail')} value={user?.email} technical style={isLandscape ? styles.cardLandscape : styles.cardPortrait} />
          <InfoCard label={i18n.t('dashboardRole')} value={user?.role ? getUserRoleLabel(user.role) : undefined} style={isLandscape ? styles.cardLandscape : styles.cardPortrait} />
        </View>

        <View style={[styles.rangeRow, isHebrew && styles.rowRtl]}>
          {[
            { label: i18n.t('dashboardRange24Hours'), value: '24h' },
            { label: i18n.t('dashboardRange7Days'), value: '7d' },
            { label: i18n.t('dashboardRange30Days'), value: '30d' },
          ].map((item) => (
            <Pressable
              key={item.value}
              style={[styles.rangeButton, range === item.value && styles.rangeButtonActive]}
              onPress={() => handleRangeChange(item.value)}
            >
              <Text style={[styles.rangeText, range === item.value && styles.rangeTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <StatusMessage message={error} />
        {error ? <AppButton title={i18n.t('dashboardTryAgain')} onPress={() => fetchStats()} loading={isLoading} /> : null}

        <View style={[styles.statsGrid, isLandscape ? styles.cardsLandscape : styles.cardsPortrait]}>
          <StatCard label={i18n.t('dashboardTotalLogs')} value={stats?.counts?.totalLogs || 0} style={isLandscape ? styles.cardLandscape : styles.cardPortrait} />
          <StatCard label={i18n.t('dashboardOpenAlerts')} value={stats?.counts?.openAlerts || 0} style={isLandscape ? styles.cardLandscape : styles.cardPortrait} />
          <StatCard label={i18n.t('dashboardWarnings')} value={stats?.counts?.byLevel?.warn || 0} style={isLandscape ? styles.cardLandscape : styles.cardPortrait} />
          <StatCard label={i18n.t('dashboardErrors')} value={stats?.counts?.byLevel?.error || 0} style={isLandscape ? styles.cardLandscape : styles.cardPortrait} />
        </View>

        <View
          style={[
            isLandscape ? styles.cardsLandscape : styles.cardsPortrait,
            isLandscape && styles.listGridLandscape,
          ]}
        >
          <ListCard
            title={i18n.t('dashboardTopIps')}
            items={stats?.topIps || []}
            labelKey="ip"
            emptyTitle={i18n.t('dashboardNoIpData')}
            style={isLandscape ? styles.cardLandscape : styles.cardPortrait}
          />

          <ListCard
            title={i18n.t('dashboardTopEventTypes')}
            items={stats?.topEventTypes || []}
            labelKey="eventType"
            emptyTitle={i18n.t('dashboardNoEventTypeData')}
            style={isLandscape ? styles.cardLandscape : styles.cardPortrait}
          />
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, isHebrew && styles.rtlText]}>{i18n.t('dashboardRecentAlerts')}</Text>
          {stats?.recent?.alerts?.length ? (
            stats.recent.alerts.slice(0, 6).map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertName}>{alert.ruleName || i18n.t('dashboardSecurityAlertFallback')}</Text>
                  <Text style={styles.alertTime}>{formatDateTime(alert.timestamp)}</Text>
                </View>
                <Text style={styles.alertDescription} numberOfLines={2}>
                  {alert.description || i18n.t('dashboardNoDescription')}
                </Text>
                <View style={[styles.badgeRow, isHebrew && styles.rowRtl]}>
                  <Text style={[styles.badge, styles[`severity_${alert.severity || 'low'}`]]}>
                    {getAlertSeverityLabel(alert.severity || 'low')}
                  </Text>
                  <Text style={[styles.badge, alert.status === 'closed' ? styles.closed : styles.open]}>
                    {getAlertStatusLabel(alert.status || 'open')}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <EmptyState title={i18n.t('dashboardNoRecentAlerts')} message={i18n.t('dashboardRecentAlertsMessage')} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({ label, value, technical, style }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={[styles.infoCard, style]}>
      <Text style={[styles.infoLabel, isHebrew && styles.rtlText]}>{label}</Text>
      <Text style={[styles.infoValue, isHebrew && (!technical || !value) && styles.rtlText, technical && value && styles.technicalText]}>
        {value || i18n.t('commonNotAvailable')}
      </Text>
    </View>
  );
}

function StatCard({ label, value, style }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={[styles.statCard, style]}>
      <Text style={[styles.statLabel, isHebrew && styles.rtlText]}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ListCard({ title, items, labelKey, emptyTitle, style }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.cardTitle, isHebrew && styles.rtlText]}>{title}</Text>
      {items.length ? (
        items.slice(0, 8).map((item, index) => (
          <View key={`${item[labelKey]}-${index}`} style={[styles.listItem, isHebrew && styles.rowRtl]}>
            <Text style={[styles.listLabel, styles.technicalText]}>{item[labelKey] || i18n.t('commonUnknown')}</Text>
            <Text style={styles.listCount}>{item.count}</Text>
          </View>
        ))
      ) : (
        <EmptyState title={emptyTitle} message={i18n.t('dashboardDataAvailableMessage')} />
      )}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    paddingBottom: 40,
  },
  containerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  containerLandscape: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
  },
  subtitle: {
    color: theme.mutedText,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 18,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 16,
  },
  cardsPortrait: {
    flexDirection: 'column',
  },
  cardsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardPortrait: {
    width: '100%',
  },
  cardLandscape: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  infoCard: {
    backgroundColor: theme.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
  },
  infoLabel: {
    color: theme.mutedText,
    fontSize: 13,
    marginBottom: 6,
  },
  infoValue: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  rangeButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: theme.card,
  },
  rangeButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  rangeText: {
    color: theme.text,
    fontWeight: '700',
  },
  rangeTextActive: {
    color: theme.headerText,
  },
  statsGrid: {
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: theme.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 18,
  },
  statLabel: {
    color: theme.mutedText,
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: theme.text,
    fontSize: 30,
    fontWeight: '800',
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    marginBottom: 16,
  },
  listGridLandscape: {
    gap: 12,
  },
  cardTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingVertical: 10,
  },
  listLabel: {
    flex: 1,
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
  listCount: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  alertItem: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingVertical: 12,
  },
  alertHeader: {
    gap: 4,
    marginBottom: 6,
  },
  alertName: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '700',
  },
  alertTime: {
    color: theme.mutedText,
    fontSize: 12,
  },
  alertDescription: {
    color: theme.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  badge: {
    overflow: 'hidden',
    color: theme.headerText,
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  severity_low: {
    backgroundColor: theme.success,
  },
  severity_medium: {
    backgroundColor: '#ca8a04',
  },
  severity_high: {
    backgroundColor: '#ea580c',
  },
  severity_critical: {
    backgroundColor: theme.danger,
  },
  open: {
    backgroundColor: theme.primary,
  },
  closed: {
    backgroundColor: theme.mutedText,
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
