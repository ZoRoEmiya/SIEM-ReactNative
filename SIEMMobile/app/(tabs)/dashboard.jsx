import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import { useAuth } from '../../src/context/AuthContext';
import { getStats } from '../../src/services/statsService';
import colors from '../../src/styles/colors';
import { formatDateTime } from '../../src/utils/formatDate';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const { user, tenant } = useAuth();
  const [stats, setStats] = useState();
  const [range, setRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isWide = width >= 700;

  const fetchStats = async (selectedRange = range) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getStats(selectedRange);
      setStats(data);
    } catch (err) {
      setError(err.error || 'Failed to load statistics');
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
    return <LoadingBox message="Loading dashboard statistics..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Security Dashboard</Text>
        <Text style={styles.subtitle}>{tenant?.name || 'SIEM Portal'}</Text>

        <View style={[styles.infoGrid, isWide && styles.twoColumns]}>
          <InfoCard label="Email" value={user?.email || 'N/A'} />
          <InfoCard label="Role" value={user?.role || 'N/A'} />
        </View>

        <View style={styles.rangeRow}>
          {[
            { label: '24h', value: '24h' },
            { label: '7d', value: '7d' },
            { label: '30d', value: '30d' },
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
        {error ? <AppButton title="Try Again" onPress={() => fetchStats()} loading={isLoading} /> : null}

        <View style={[styles.statsGrid, isWide && styles.twoColumns]}>
          <StatCard label="Total Logs" value={stats?.counts?.totalLogs || 0} />
          <StatCard label="Open Alerts" value={stats?.counts?.openAlerts || 0} />
          <StatCard label="Warnings" value={stats?.counts?.byLevel?.warn || 0} />
          <StatCard label="Errors" value={stats?.counts?.byLevel?.error || 0} />
        </View>

        <ListCard
          title="Top IPs"
          items={stats?.topIps || []}
          labelKey="ip"
          emptyTitle="No IP data"
        />

        <ListCard
          title="Top Event Types"
          items={stats?.topEventTypes || []}
          labelKey="eventType"
          emptyTitle="No event type data"
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Alerts</Text>
          {stats?.recent?.alerts?.length ? (
            stats.recent.alerts.slice(0, 6).map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertName}>{alert.ruleName || 'Security Alert'}</Text>
                  <Text style={styles.alertTime}>{formatDateTime(alert.timestamp)}</Text>
                </View>
                <Text style={styles.alertDescription} numberOfLines={2}>
                  {alert.description || 'No description'}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.badge}>{alert.severity || 'low'}</Text>
                  <Text style={styles.badge}>{alert.status || 'open'}</Text>
                </View>
              </View>
            ))
          ) : (
            <EmptyState title="No recent alerts" message="Recent alerts will appear here." />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({ label, value }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ListCard({ title, items, labelKey, emptyTitle }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.length ? (
        items.slice(0, 8).map((item, index) => (
          <View key={`${item[labelKey]}-${index}`} style={styles.listItem}>
            <Text style={styles.listLabel}>{item[labelKey] || 'Unknown'}</Text>
            <Text style={styles.listCount}>{item.count}</Text>
          </View>
        ))
      ) : (
        <EmptyState title={emptyTitle} message="Data will appear when logs are available." />
      )}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 18,
  },
  infoGrid: {
    gap: 12,
    marginBottom: 16,
  },
  twoColumns: {
    flexDirection: 'row',
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 6,
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  rangeButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    backgroundColor: colors.card,
  },
  rangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rangeText: {
    color: colors.text,
    fontWeight: '700',
  },
  rangeTextActive: {
    color: '#ffffff',
  },
  statsGrid: {
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 10,
  },
  listLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  listCount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  alertItem: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 12,
  },
  alertHeader: {
    gap: 4,
    marginBottom: 6,
  },
  alertName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  alertTime: {
    color: colors.muted,
    fontSize: 12,
  },
  alertDescription: {
    color: colors.muted,
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
    color: colors.text,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
});
