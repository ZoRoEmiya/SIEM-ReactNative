import api, { cleanParams, getApiError } from './api';

export const getAlerts = async (filters = {}) => {
  try {
    const response = await api.get('/alerts', {
      params: cleanParams(filters),
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to fetch alerts');
  }
};

export const updateAlertStatus = async (id, status) => {
  try {
    const response = await api.patch(`/alerts/${id}`, { status });
    return response.data;
  } catch (error) {
    throw getApiError(error, 'Failed to update alert status');
  }
};
