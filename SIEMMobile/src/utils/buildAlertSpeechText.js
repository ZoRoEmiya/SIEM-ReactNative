import { formatDateTime } from './formatDate';
import i18n from '../localization/i18n';
import { getAlertSeverityLabel, getAlertStatusLabel } from '../localization/labels';

/**
 * Format an alert value for readable speech
 * @param {*} value - Alert value
 * @returns {string} Readable value
 */
const formatValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map(formatValue).filter(Boolean).join(', ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, itemValue]) => `${key}, ${formatValue(itemValue)}`)
      .filter((item) => item.trim() !== '')
      .join(', ');
  }

  return String(value);
};

/**
 * Format alert entities for readable speech
 * @param {object} entities - Alert entities
 * @returns {string} Readable entities text
 */
const formatEntities = (entities) => {
  if (!entities || !Object.keys(entities).length) {
    return '';
  }

  return Object.entries(entities)
    .map(([key, value]) => {
      const formattedValue = formatValue(value);
      return formattedValue ? `${key}, ${formattedValue}` : '';
    })
    .filter(Boolean)
    .join('. ');
};

/**
 * Build readable speech text from a security alert
 * @param {object} alert - Security alert data
 * @returns {string} Formatted alert text for speech
 */
export const buildAlertSpeechText = (alert) => {
  if (!alert) {
    return i18n.t('alertSpeechUnavailable');
  }

  const parts = [i18n.t('alertSpeechIntro')];

  if (alert.ruleName) {
    parts.push(i18n.t('alertSpeechRule', { value: alert.ruleName }));
  }

  if (alert.severity) {
    parts.push(i18n.t('alertSpeechSeverity', { value: getAlertSeverityLabel(alert.severity) }));
  }

  if (alert.status) {
    parts.push(i18n.t('alertSpeechStatus', { value: getAlertStatusLabel(alert.status) }));
  }

  if (alert.ts) {
    parts.push(i18n.t('alertSpeechTime', { value: formatDateTime(alert.ts) }));
  }

  if (alert.description) {
    parts.push(i18n.t('alertSpeechDescription', { value: alert.description }));
  }

  const entitiesText = formatEntities(alert.entities);

  if (entitiesText) {
    parts.push(i18n.t('alertSpeechEntities', { value: entitiesText }));
  }

  return parts.join('. ');
};
