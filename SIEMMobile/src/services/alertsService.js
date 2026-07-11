import api, { cleanParams, getApiError } from './api';
import i18n from '../localization/i18n';

export const getAlerts = async (filters = {}) => {
  try {
    const response = await api.get('/alerts', {
      params: cleanParams(filters),
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('alertsFailedToLoad'));
  }
};

export const updateAlertStatus = async (id, status) => {
  try {
    const response = await api.patch(`/alerts/${id}`, { status });
    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('alertsUpdateFailed'));
  }
};
