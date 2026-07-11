import api, { cleanParams, getApiError } from './api';
import i18n from '../localization/i18n';

export const getLogs = async (filters = {}) => {
  try {
    const response = await api.get('/logs', {
      params: cleanParams(filters),
    });

    return response.data;
  } catch (error) {
    throw getApiError(error, i18n.t('logsFailedToLoad'));
  }
};

export const getLogsByIds = async (ids = []) => {
  try {
    if (!ids.length) {
      return [];
    }

    const response = await api.get('/logs', {
      params: {
        ids: ids.join(','),
        limit: ids.length,
      },
    });

    return response.data.items || [];
  } catch (error) {
    throw getApiError(error, i18n.t('logsFailedByIds'));
  }
};
