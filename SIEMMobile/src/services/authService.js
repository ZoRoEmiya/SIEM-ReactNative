import api, { getApiError } from './api';

export const registerUser = async (companyName, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      companyName,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, 'Registration failed');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, 'Login failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch user info');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.patch('/auth/me', profileData);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to update profile');
  }
};

export const deleteProfile = async () => {
  try {
    const response = await api.delete('/auth/me');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to delete account');
  }
};
