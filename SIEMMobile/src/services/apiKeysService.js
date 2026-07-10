import api, { getApiError } from './api';
import i18n from '../localization/i18n';

export const getApiKeys = async () => {
  try {
    const response = await api.get('/api-keys');
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('apiKeysFailedToLoad'));
  }
};

export const createApiKey = async (name) => {
  try {
    const response = await api.post('/api-keys', { name });
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('apiKeysFailedToCreate'));
  }
};

export const revokeApiKey = async (id) => {
  try {
    const response = await api.patch(`/api-keys/${id}/revoke`);
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('apiKeysFailedToRevoke'));
  }
};
