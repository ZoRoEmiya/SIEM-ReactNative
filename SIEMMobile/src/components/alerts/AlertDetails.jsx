import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';
import AppButton from '../common/AppButton';
import StatusMessage from '../common/StatusMessage';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import i18n from '../../localization/i18n';
import { getAlertSeverityLabel, getAlertStatusLabel } from '../../localization/labels';
import { buildAlertSpeechText } from '../../utils/buildAlertSpeechText';
import { formatDateTime } from '../../utils/formatDate';

/**
 * Display security alert details and speech controls
 * @param {object} props - Component properties
 * @param {object} props.alert - Selected security alert
 * @param {Function} props.onClose - Close alert details
 * @param {Function} props.onToggleStatus - Toggle alert open or closed status
 * @param {boolean} props.updating - Whether alert status is updating
 * @param {string} props.message - Success message
 * @param {string} props.error - Error message
 * @param {boolean} props.isLandscape - Whether the screen is in landscape orientation
 * @returns {JSX.Element|null} Alert details content
 */
export default function AlertDetails({ alert, onClose, onToggleStatus, updating, message, error, isLandscape }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechError, setSpeechError] = useState('');

  /**
   * Stop the current speech
   * @returns {Promise<void>}
   */
  const handleStopSpeech = async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  /**
   * Read the selected security alert aloud
   * @returns {Promise<void>}
   */
  const handleReadAlert = async () => {
    if (!alert) {
      return;
    }

    setSpeechError('');

    try {
      const speechText = buildAlertSpeechText(alert);
      await Speech.stop();
      setIsSpeaking(true);
      setIsPaused(false);

      Speech.speak(speechText, {
        rate,
        pitch,
        onPause: () => {
          setIsPaused(true);
        },
        onResume: () => {
          setIsPaused(false);
        },
        onDone: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onStopped: () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
      });
    } catch (err) {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechError(i18n.t('alertSpeechFailed'));
    }
  };

  /**
   * Pause the current speech on iOS
   * @returns {Promise<void>}
   */
  const handlePauseSpeech = async () => {
    if (Platform.OS === 'ios') {
      await Speech.pause();
      setIsPaused(true);
    }
  };

  /**
   * Resume paused speech on iOS
   * @returns {Promise<void>}
   */
  const handleResumeSpeech = async () => {
    if (Platform.OS === 'ios') {
      await Speech.resume();
      setIsPaused(false);
    }
  };

  /**
   * Stop speech before closing alert details
   * @returns {Promise<void>}
   */
  const handleCloseDetails = async () => {
    await handleStopSpeech();
    onClose();
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, [alert]);

  if (!alert) {
    return null;
  }

  const nextStatusLabel = alert.status === 'open' ? i18n.t('alertCloseAction') : i18n.t('alertReopenAction');

  return (
    <View
      style={[
        styles.container,
        isLandscape
          ? styles.containerLandscape
          : styles.containerPortrait,
      ]}
    >
      <Text style={[styles.title, isHebrew && !alert.ruleName && styles.rtlText]}>{alert.ruleName || i18n.t('dashboardSecurityAlertFallback')}</Text>
      <StatusMessage message={message} type="success" />
      <StatusMessage message={error} />
      <StatusMessage message={speechError} />

      <View style={[isLandscape ? styles.detailsLandscape : styles.detailsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <DetailRow label={i18n.t('logsTime')} value={formatDateTime(alert.ts)} style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
        <DetailRow label={i18n.t('alertFilterSeverity')} value={getAlertSeverityLabel(alert.severity)} translated style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
        <DetailRow label={i18n.t('alertFilterStatus')} value={getAlertStatusLabel(alert.status)} translated style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
        <DetailRow label={i18n.t('alertDescription')} value={alert.description} style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
      </View>

      <Text style={[styles.sectionTitle, isHebrew && styles.rtlText]}>{i18n.t('alertEntities')}</Text>
      {alert.entities && Object.keys(alert.entities).length ? (
        <View style={[isLandscape ? styles.detailsLandscape : styles.detailsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
          {Object.entries(alert.entities).map(([key, value]) => (
            <DetailRow
              key={key}
              label={key}
              value={String(value)}
              style={isLandscape ? styles.detailLandscape : styles.detailPortrait}
            />
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, isHebrew && styles.rtlText]}>{i18n.t('alertNoEntities')}</Text>
      )}

      <Text style={[styles.sectionTitle, isHebrew && styles.rtlText]}>{i18n.t('alertReadSection')}</Text>
      <View style={styles.speechBox}>
        <View style={[styles.sliderHeader, isHebrew && styles.rowRtl]}>
          <Text style={[styles.sliderLabel, isHebrew && styles.rtlText]}>{i18n.t('alertSpeechRate')}</Text>
          <Text style={styles.sliderValue}>{rate.toFixed(1)}</Text>
        </View>
        <Slider
          value={rate}
          onValueChange={setRate}
          minimumValue={0.5}
          maximumValue={2}
          step={0.1}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />

        <View style={[styles.sliderHeader, isHebrew && styles.rowRtl]}>
          <Text style={[styles.sliderLabel, isHebrew && styles.rtlText]}>{i18n.t('alertSpeechPitch')}</Text>
          <Text style={styles.sliderValue}>{pitch.toFixed(1)}</Text>
        </View>
        <Slider
          value={pitch}
          onValueChange={setPitch}
          minimumValue={0.5}
          maximumValue={2}
          step={0.1}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
        />

        <View style={[styles.speechActions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
          <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
            <AppButton title={i18n.t('alertReadAction')} onPress={handleReadAlert} disabled={isSpeaking} />
          </View>
          <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
            <AppButton title={i18n.t('alertStopReading')} onPress={handleStopSpeech} disabled={!isSpeaking} variant="secondary" />
          </View>
          {Platform.OS === 'ios' ? (
            <>
              <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
                <AppButton title={i18n.t('alertPauseSpeech')} onPress={handlePauseSpeech} disabled={!isSpeaking || isPaused} variant="secondary" />
              </View>
              <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
                <AppButton title={i18n.t('alertResumeSpeech')} onPress={handleResumeSpeech} disabled={!isSpeaking || !isPaused} variant="secondary" />
              </View>
            </>
          ) : null}
        </View>
      </View>

      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={nextStatusLabel} onPress={onToggleStatus} loading={updating} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('commonClose')} onPress={handleCloseDetails} disabled={updating} variant="secondary" />
        </View>
      </View>
    </View>
  );
}

/**
 * Display one alert detail row
 * @param {object} props - Component properties
 * @param {string} props.label - Detail label
 * @param {string} props.value - Detail value
 * @param {boolean} props.translated - Whether the value is translated interface text
 * @param {object} props.style - Additional detail row style
 * @returns {JSX.Element} Alert detail row
 */
function DetailRow({ label, value, translated = false, style }) {
  const { theme } = useTheme();
  const { isHebrew } = useLanguage();
  const styles = createStyles(theme);

  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.label, isHebrew && styles.rtlText]}>{label}</Text>
      <Text style={[styles.value, (translated || !value) && isHebrew ? styles.rtlText : styles.technicalText]}>{value || i18n.t('commonNotAvailable')}</Text>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  containerPortrait: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  containerLandscape: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  row: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
  },
  detailsPortrait: {
    flexDirection: 'column',
  },
  detailsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  detailPortrait: {
    width: '100%',
    marginBottom: 10,
  },
  detailLandscape: {
    flexBasis: '48%',
    flexGrow: 1,
    marginBottom: 10,
  },
  label: {
    color: theme.mutedText,
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  value: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 10,
  },
  emptyText: {
    color: theme.mutedText,
    fontSize: 14,
    marginBottom: 16,
  },
  speechBox: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sliderLabel: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '700',
  },
  sliderValue: {
    color: theme.mutedText,
    fontSize: 14,
    fontWeight: '700',
  },
  speechActions: {
    gap: 10,
    marginTop: 12,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  actionsPortrait: {
    flexDirection: 'column',
  },
  actionsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionPortrait: {
    width: '100%',
  },
  actionLandscape: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  technicalText: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
