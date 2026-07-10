import { Redirect, Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import LoadingBox from '../../src/components/common/LoadingBox';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabsLayout() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
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
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: { color: theme.headerText },
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        headerRight: () => (
          <View style={styles.headerActions}>
            <View style={styles.themeControl}>
              <Text style={[styles.themeLabel, { color: theme.headerText }]}>Dark</Text>
              <Switch
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.headerText}
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            </View>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={[styles.logoutText, { color: theme.headerText }]}>Sign Out</Text>
            </Pressable>
          </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
