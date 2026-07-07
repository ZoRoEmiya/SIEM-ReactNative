import api, { getApiError } from './api';

export const getStats = async (range = '24h') => {
  try {
    const response = await api.get('/stats', {
      params: { range },
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch statistics');
  }
};
