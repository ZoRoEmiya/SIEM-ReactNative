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
import { createUser, deleteUser, getUsers, updateUserRole } from '../../src/services/usersService';
import colors from '../../src/styles/colors';
import { isEmail, isPasswordLongEnough, isRequired } from '../../src/utils/validators';

export default function UsersScreen() {
  const { user } = useAuth();
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

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.error || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setFormError('');

    if (!isRequired(newEmail)) {
      setFormError('Email is required');
      return;
    }

    if (!isEmail(newEmail)) {
      setFormError('Please provide a valid email address');
      return;
    }

    if (!isPasswordLongEnough(newPassword)) {
      setFormError('Password must be at least 8 characters');
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
      setFormError(err.error || 'Failed to create user');
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
      setError(err.error || 'Failed to update user role');
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
      setError(err.error || 'Failed to delete user');
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
        <View style={styles.container}>
          <Text style={styles.title}>Access Denied</Text>
          <Text style={styles.text}>You don't have permission to view this page.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading && !users.length) {
    return <LoadingBox message="Loading users..." />;
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
          />
        )}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>User Management</Text>
            <Text style={styles.text}>Manage users in your organization.</Text>
            <StatusMessage message={error} />
            <AppButton title="Add User" onPress={() => setShowCreate(true)} />
          </View>
        }
        ListEmptyComponent={<EmptyState title="No users found" message="Add a user to this organization." />}
      />

      <Modal visible={showCreate} animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New User</Text>
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
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal visible={Boolean(roleUser)} transparent animationType="fade" onRequestClose={() => setRoleUser()}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Change Role</Text>
            <Text style={styles.text}>{roleUser?.email}</Text>
            <View style={styles.roleActions}>
              {['viewer', 'analyst', 'admin'].map((role) => (
                <AppButton
                  key={role}
                  title={role}
                  onPress={() => handleUpdateRole(role)}
                  disabled={working || roleUser?.role === role}
                  variant={roleUser?.role === role ? 'secondary' : 'primary'}
                />
              ))}
              <AppButton title="Cancel" onPress={() => setRoleUser()} disabled={working} variant="secondary" />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={Boolean(deleteTarget)} transparent animationType="fade" onRequestClose={() => setDeleteTarget()}>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Delete User</Text>
            <Text style={styles.text}>Delete {deleteTarget?.email}? This action cannot be undone.</Text>
            <View style={styles.roleActions}>
              <AppButton title="Delete" onPress={handleDeleteUser} loading={working} />
              <AppButton title="Cancel" onPress={() => setDeleteTarget()} disabled={working} variant="secondary" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 16,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  confirmOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    padding: 24,
  },
  confirmBox: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 18,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  roleActions: {
    gap: 10,
    marginTop: 14,
  },
});
