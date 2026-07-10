import api, { getApiError } from './api';

export const getApiKeys = async () => {
  try {
    const response = await api.get('/api-keys');
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch API keys');
  }
};

export const createApiKey = async (name) => {
  try {
    const response = await api.post('/api-keys', { name });
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to create API key');
  }
};

export const revokeApiKey = async (id) => {
  try {
    const response = await api.patch(`/api-keys/${id}/revoke`);
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to revoke API key');
  }
};
