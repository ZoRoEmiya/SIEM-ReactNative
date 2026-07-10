import i18n from '../localization/i18n';

export const formatDateTime = (dateString) => {
  if (!dateString) {
    return i18n.t('commonNotAvailable');
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return i18n.t('commonNotAvailable');
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
