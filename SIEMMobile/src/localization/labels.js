import i18n from './i18n';

/**
 * Get the translated label for a log level
 * @param {string} level - Raw log level value
 * @returns {string} Translated log level label
 */
export const getLogLevelLabel = (level) => {
  const keys = {
    info: 'logLevelInfo',
    warn: 'logLevelWarn',
    error: 'logLevelError',
    critical: 'logLevelCritical',
  };

  return i18n.t(keys[level] || 'commonUnknown');
};

/**
 * Get the translated label for an alert severity
 * @param {string} severity - Raw alert severity value
 * @returns {string} Translated alert severity label
 */
export const getAlertSeverityLabel = (severity) => {
  const keys = {
    low: 'alertSeverityLow',
    medium: 'alertSeverityMedium',
    high: 'alertSeverityHigh',
    critical: 'alertSeverityCritical',
  };

  return i18n.t(keys[severity] || 'commonUnknown');
};

/**
 * Get the translated label for an alert status
 * @param {string} status - Raw alert status value
 * @returns {string} Translated alert status label
 */
export const getAlertStatusLabel = (status) => {
  const keys = {
    open: 'alertStatusOpen',
    closed: 'alertStatusClosed',
  };

  return i18n.t(keys[status] || 'commonUnknown');
};

/**
 * Get the translated label for a user role
 * @param {string} role - Raw user role value
 * @returns {string} Translated user role label
 */
export const getUserRoleLabel = (role) => {
  const keys = {
    admin: 'roleAdmin',
    analyst: 'roleAnalyst',
    viewer: 'roleViewer',
  };

  return i18n.t(keys[role] || 'commonUnknown');
};
