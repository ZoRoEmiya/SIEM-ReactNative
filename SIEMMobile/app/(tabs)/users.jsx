import { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../src/components/common/AppButton';
import EmptyState from '../../src/components/common/EmptyState';
import LoadingBox from '../../src/components/common/LoadingBox';
import StatusMessage from '../../src/components/common/StatusMessage';
import UserCard from '../../src/components/users/UserCard';
import UserForm from '../../src/components/users/UserForm';
import { useAuth } from '../../src/context/AuthContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useOrientation } from '../../src/hooks/useOrientation';
import i18n from '../../src/localization/i18n';
import { getUserRoleLabel } from '../../src/localization/labels';
import { createUser, deleteUser, getUsers, updateUserRole } from '../../src/services/usersService';
import { isEmail, isPasswordLongEnough, isRequired } from '../../src/utils/validators';

export default function UsersScreen() {
  const { user } = useAuth();
  const { isHebrew } = useLanguage();
  const { theme } = useTheme();
  const { isLandscape, width, height } = useOrientation();
  const styles = createStyles(theme);
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('viewer');
  const [roleUser, setRoleUser] = useState();
  const [deleteTarget, setDeleteTarget] = useState();
  const [showCreate, setShowCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const isAdmin = user?.role === 'admin';
  const modalDimensions = {
    width: Math.min(width, isLandscape ? 760 : width),
    minHeight: height,
  };
  const confirmDimensions = {
    width: Math.min(Math.max(width - (isLandscape ? 64 : 48), 0), 640),
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.error || i18n.t('usersFailedToLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setFormError('');

    if (!isRequired(newEmail)) {
      setFormError(i18n.t('authEmailRequired'));
      return;
    }

    if (!isEmail(newEmail)) {
      setFormError(i18n.t('validationValidEmail'));
      return;
    }

    if (!isPasswordLongEnough(newPassword)) {
      setFormError(i18n.t('authPasswordMinimum'));
      return;
    }

    setWorking(true);

    try {
      await createUser(newEmail.trim(), newPassword, newRole);
      setShowCreate(false);
      setNewEmail('');
      setNewPassword('');
      setNewRole('viewer');
      await fetchUsers();
    } catch (err) {
      setFormError(err.error || i18n.t('usersFailedToCreate'));
    } finally {
      setWorking(false);
    }
  };

  const handleUpdateRole = async (role) => {
    if (!roleUser) {
      return;
    }

    setWorking(true);
    setError('');

    try {
      await updateUserRole(roleUser.id, role);
      setUsers(users.map((item) => (item.id === roleUser.id ? { ...item, role } : item)));
      setRoleUser();
    } catch (err) {
      setError(err.error || i18n.t('usersFailedToUpdateRole'));
    } finally {
      setWorking(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) {
      return;
    }

    setWorking(true);
    setError('');

    try {
      await deleteUser(deleteTarget.id);
      setUsers(users.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget();
    } catch (err) {
      setError(err.error || i18n.t('usersFailedToDelete'));
    } finally {
      setWorking(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, isLandscape ? styles.containerLandscape : styles.containerPortrait]}>
          <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('commonAccessDenied')}</Text>
          <Text style={[styles.text, isHebrew && styles.rtlText]}>{i18n.t('commonNoPermission')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !users.length) {
    return <LoadingBox message={i18n.t('usersLoading')} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item.id || `user-${index}`}
        renderItem={({ item }) => (
          <UserCard
            item={item}
            currentUserId={user?.id}
            onChangeRole={() => setRoleUser(item)}
            onDelete={() => setDeleteTarget(item)}
            loading={working}
            isLandscape={isLandscape}
          />
        )}
        contentContainerStyle={[
          styles.container,
          isLandscape
            ? styles.containerLandscape
            : styles.containerPortrait,
        ]}
        ListHeaderComponent={
          <View>
            <Text style={[styles.title, isHebrew && styles.rtlText]}>{i18n.t('usersTitle')}</Text>
            <Text style={[styles.text, isHebrew && styles.rtlText]}>{i18n.t('usersSubtitle')}</Text>
            <StatusMessage message={error} />
            <AppButton title={i18n.t('usersAddAction')} onPress={() => setShowCreate(true)} />
          </View>
        }
        ListEmptyComponent={<EmptyState title={i18n.t('usersEmptyTitle')} message={i18n.t('usersEmptyMessage')} />}
      />

      <Modal visible={showCreate} animationType="slide" onRequestClose={() => setShowCreate(false)}>
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
            <Text style={[styles.modalTitle, isHebrew && styles.rtlText]}>{i18n.t('usersAddTitle')}</Text>
            <StatusMessage message={formError} />
            <UserForm
              email={newEmail}
              password={newPassword}
              role={newRole}
              onChangeEmail={setNewEmail}
              onChangePassword={setNewPassword}
              onChangeRole={setNewRole}
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreate(false)}
              loading={working}
              isLandscape={isLandscape}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(roleUser)} transparent animationType="fade" onRequestClose={() => setRoleUser()}>
        <View style={styles.confirmOverlay}>
          <View
            style={[
              styles.confirmBox,
              isLandscape
                ? styles.confirmBoxLandscape
                : styles.confirmBoxPortrait,
              confirmDimensions,
            ]}
          >
            <Text style={[styles.confirmTitle, isHebrew && styles.rtlText]}>{i18n.t('usersChangeRoleTitle')}</Text>
            <Text style={[styles.text, styles.technicalText]}>{roleUser?.email}</Text>
            <View style={[styles.roleActions, isLandscape ? styles.roleActionsLandscape : styles.roleActionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
              {['viewer', 'analyst', 'admin'].map((role) => (
                <AppButton
                  key={role}
                  title={getUserRoleLabel(role)}
                  onPress={() => handleUpdateRole(role)}
                  disabled={working || roleUser?.role === role}
                  variant={roleUser?.role === role ? 'secondary' : 'primary'}
                />
              ))}
              <AppButton title={i18n.t('commonCancel')} onPress={() => setRoleUser()} disabled={working} variant="secondary" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={Boolean(deleteTarget)} transparent animationType="fade" onRequestClose={() => setDeleteTarget()}>
        <View style={styles.confirmOverlay}>
          <View
            style={[
              styles.confirmBox,
              isLandscape
                ? styles.confirmBoxLandscape
                : styles.confirmBoxPortrait,
              confirmDimensions,
            ]}
          >
            <Text style={[styles.confirmTitle, isHebrew && styles.rtlText]}>{i18n.t('usersDeleteTitle')}</Text>
            <Text style={[styles.text, isHebrew && styles.rtlText]}>
              {i18n.t('usersDeleteMessage', { email: deleteTarget?.email })}
            </Text>
            <View style={styles.roleActions}>
              <AppButton title={i18n.t('commonDelete')} onPress={handleDeleteUser} loading={working} variant="danger" />
              <AppButton title={i18n.t('commonCancel')} onPress={() => setDeleteTarget()} disabled={working} variant="secondary" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    maxWidth: 1000,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: theme.mutedText,
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.modalBackdrop,
    padding: 24,
  },
  confirmBox: {
    alignSelf: 'center',
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 18,
  },
  confirmBoxPortrait: {
    maxWidth: 520,
  },
  confirmBoxLandscape: {
    maxWidth: 640,
  },
  confirmTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  roleActions: {
    gap: 10,
    marginTop: 14,
  },
  roleActionsPortrait: {
    flexDirection: 'column',
  },
  roleActionsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
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
