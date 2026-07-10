import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';
import AppButton from '../common/AppButton';
import StatusMessage from '../common/StatusMessage';
import { useTheme } from '../../context/ThemeContext';
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
      setSpeechError('Failed to read alert aloud');
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

  const nextStatusLabel = alert.status === 'open' ? 'Close Alert' : 'Reopen Alert';

  return (
    <View
      style={[
        styles.container,
        isLandscape
          ? styles.containerLandscape
          : styles.containerPortrait,
      ]}
    >
      <Text style={styles.title}>{alert.ruleName || 'Security Alert'}</Text>
      <StatusMessage message={message} type="success" />
      <StatusMessage message={error} />
      <StatusMessage message={speechError} />

      <View style={isLandscape ? styles.detailsLandscape : styles.detailsPortrait}>
        <DetailRow label="Time" value={formatDateTime(alert.ts)} style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
        <DetailRow label="Severity" value={alert.severity} style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
        <DetailRow label="Status" value={alert.status} style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
        <DetailRow label="Description" value={alert.description} style={isLandscape ? styles.detailLandscape : styles.detailPortrait} />
      </View>

      <Text style={styles.sectionTitle}>Entities</Text>
      {alert.entities && Object.keys(alert.entities).length ? (
        <View style={isLandscape ? styles.detailsLandscape : styles.detailsPortrait}>
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
        <Text style={styles.emptyText}>No entities associated with this alert.</Text>
      )}

      <Text style={styles.sectionTitle}>Read Alert</Text>
      <View style={styles.speechBox}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Speech Rate</Text>
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

        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Speech Pitch</Text>
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

        <View style={[styles.speechActions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait]}>
          <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
            <AppButton title="Read Alert" onPress={handleReadAlert} disabled={isSpeaking} />
          </View>
          <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
            <AppButton title="Stop Reading" onPress={handleStopSpeech} disabled={!isSpeaking} variant="secondary" />
          </View>
          {Platform.OS === 'ios' ? (
            <>
              <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
                <AppButton title="Pause" onPress={handlePauseSpeech} disabled={!isSpeaking || isPaused} variant="secondary" />
              </View>
              <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
                <AppButton title="Resume" onPress={handleResumeSpeech} disabled={!isSpeaking || !isPaused} variant="secondary" />
              </View>
            </>
          ) : null}
        </View>
      </View>

      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={nextStatusLabel} onPress={onToggleStatus} loading={updating} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Close" onPress={handleCloseDetails} disabled={updating} variant="secondary" />
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
 * @param {object} props.style - Additional detail row style
 * @returns {JSX.Element} Alert detail row
 */
function DetailRow({ label, value, style }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.row, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
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
});
