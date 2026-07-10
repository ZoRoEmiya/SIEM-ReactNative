import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Speech from 'expo-speech';
import AppButton from '../common/AppButton';
import StatusMessage from '../common/StatusMessage';
import colors from '../../styles/colors';
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
 * @returns {JSX.Element|null} Alert details content
 */
export default function AlertDetails({ alert, onClose, onToggleStatus, updating, message, error }) {
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
    <View style={styles.container}>
      <Text style={styles.title}>{alert.ruleName || 'Security Alert'}</Text>
      <StatusMessage message={message} type="success" />
      <StatusMessage message={error} />
      <StatusMessage message={speechError} />

      <DetailRow label="Time" value={formatDateTime(alert.ts)} />
      <DetailRow label="Severity" value={alert.severity} />
      <DetailRow label="Status" value={alert.status} />
      <DetailRow label="Description" value={alert.description} />

      <Text style={styles.sectionTitle}>Entities</Text>
      {alert.entities && Object.keys(alert.entities).length ? (
        Object.entries(alert.entities).map(([key, value]) => (
          <DetailRow key={key} label={key} value={String(value)} />
        ))
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
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
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
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />

        <View style={styles.speechActions}>
          <AppButton title="Read Alert" onPress={handleReadAlert} disabled={isSpeaking} />
          <AppButton title="Stop Reading" onPress={handleStopSpeech} disabled={!isSpeaking} variant="secondary" />
          {Platform.OS === 'ios' ? (
            <>
              <AppButton title="Pause" onPress={handlePauseSpeech} disabled={!isSpeaking || isPaused} variant="secondary" />
              <AppButton title="Resume" onPress={handleResumeSpeech} disabled={!isSpeaking || !isPaused} variant="secondary" />
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton title={nextStatusLabel} onPress={onToggleStatus} loading={updating} />
        <AppButton title="Close" onPress={handleCloseDetails} disabled={updating} variant="secondary" />
      </View>
    </View>
  );
}

/**
 * Display one alert detail row
 * @param {object} props - Component properties
 * @param {string} props.label - Detail label
 * @param {string} props.value - Detail value
 * @returns {JSX.Element} Alert detail row
 */
function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  row: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: 16,
  },
  speechBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  sliderValue: {
    color: colors.muted,
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
});
