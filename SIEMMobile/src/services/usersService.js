import api, { getApiError } from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch users');
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
    throw getApiError(error, 'Failed to create user');
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to update user role');
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to delete user');
  }
};
