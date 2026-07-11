import api, { getApiError } from './api';
import i18n from '../localization/i18n';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('usersFailedToLoad'));
  }
};

export const createUser = async (email, password, role) => {
  try {
    const response = await api.post('/users', {
      email,
      password,
      role,
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('usersFailedToCreate'));
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('usersFailedToUpdateRole'));
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('usersFailedToDelete'));
  }
};
