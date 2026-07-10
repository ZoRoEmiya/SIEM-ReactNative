import api, { getApiError } from './api';
import i18n from '../localization/i18n';

export const registerUser = async (companyName, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      companyName,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('authRegistrationFailed'));
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
    throw getApiError(error, i18n.t('authLoginFailed'));
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('authSessionFailed'));
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.patch('/auth/me', profileData);
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('profileUpdateFailed'));
  }
};

export const deleteProfile = async () => {
  try {
    const response = await api.delete('/auth/me');
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('profileDeleteFailed'));
  }
};
