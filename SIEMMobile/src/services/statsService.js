import api, { getApiError } from './api';
import i18n from '../localization/i18n';

export const getStats = async (range = '24h') => {
  try {
    const response = await api.get('/stats', {
      params: { range },
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('dashboardFailedToLoad'));
  }
};
