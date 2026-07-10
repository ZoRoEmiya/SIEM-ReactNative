import { Redirect, Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import LoadingBox from '../../src/components/common/LoadingBox';
import { useAuth } from '../../src/context/AuthContext';
import colors from '../../src/styles/colors';

export default function TabsLayout() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (isLoading) {
    return <LoadingBox message="Restoring session..." />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#ffffff',
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        headerRight: () => (
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="logs" options={{ title: 'Logs' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="apiKeys" options={{ title: 'API Keys', href: isAdmin ? '/apiKeys' : null }} />
      <Tabs.Screen name="users" options={{ title: 'Users', href: isAdmin ? '/users' : null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '700',
  },
});
