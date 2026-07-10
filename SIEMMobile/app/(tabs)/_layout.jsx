import { Redirect, Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import LanguageSwitcher from '../../src/components/common/LanguageSwitcher';
import LoadingBox from '../../src/components/common/LoadingBox';
import { useAuth } from '../../src/context/AuthContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';

export default function TabsLayout() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { isHebrew } = useLanguage();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { isLandscape } = useOrientation();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (isLoading) {
    return <LoadingBox message={i18n.t('navigationRestoringSession')} />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.headerText,
        headerTitleStyle: {
          color: theme.headerText,
          writingDirection: isHebrew ? 'rtl' : 'ltr',
        },
        tabBarStyle: [
          {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.border,
          },
          isLandscape && styles.tabBarLandscape,
        ],
        tabBarLabelStyle: isLandscape ? styles.tabBarLabelLandscape : undefined,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        headerRight: () => (
          <View style={[styles.headerActions, isHebrew && styles.headerActionsRtl]}>
            <LanguageSwitcher compact />
            <View style={[styles.themeControl, isHebrew && styles.themeControlRtl]}>
              <Text style={[styles.themeLabel, { color: theme.headerText }, isHebrew && styles.rtlText]}>{i18n.t('headerDarkMode')}</Text>
              <Switch
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.headerText}
                value={isDarkMode}
                onValueChange={toggleTheme}
              />
            </View>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={[styles.logoutText, { color: theme.headerText }, isHebrew && styles.rtlText]}>{i18n.t('headerSignOut')}</Text>
            </Pressable>
          </View>
        ),
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: i18n.t('tabsDashboard') }} />
      <Tabs.Screen name="logs" options={{ title: i18n.t('tabsLogs') }} />
      <Tabs.Screen name="alerts" options={{ title: i18n.t('tabsAlerts') }} />
      <Tabs.Screen name="profile" options={{ title: i18n.t('tabsProfile') }} />
      <Tabs.Screen name="apiKeys" options={{ title: i18n.t('tabsApiKeys'), href: isAdmin ? '/apiKeys' : null }} />
      <Tabs.Screen name="users" options={{ title: i18n.t('tabsUsers'), href: isAdmin ? '/users' : null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLandscape: {
    height: 48,
    paddingTop: 4,
    paddingBottom: 4,
  },
  tabBarLabelLandscape: {
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionsRtl: {
    flexDirection: 'row-reverse',
  },
  themeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  themeControlRtl: {
    flexDirection: 'row-reverse',
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
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
