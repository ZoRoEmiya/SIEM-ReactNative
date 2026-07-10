import { formatDateTime } from './formatDate';

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
    return 'Security alert details are not available.';
  }

  const parts = ['Security alert'];

  if (alert.ruleName) {
    parts.push(`Rule: ${alert.ruleName}`);
  }

  if (alert.severity) {
    parts.push(`Severity: ${alert.severity}`);
  }

  if (alert.status) {
    parts.push(`Status: ${alert.status}`);
  }

  if (alert.ts) {
    parts.push(`Time: ${formatDateTime(alert.ts)}`);
  }

  if (alert.description) {
    parts.push(`Description: ${alert.description}`);
  }

  const entitiesText = formatEntities(alert.entities);

  if (entitiesText) {
    parts.push(`Entities: ${entitiesText}`);
  }

  return parts.join('. ');
};
