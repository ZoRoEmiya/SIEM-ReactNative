import { StyleSheet, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';
import { useLanguage } from '../../context/LanguageContext';
import i18n from '../../localization/i18n';

export default function ApiKeyForm({ name, onChangeName, onSubmit, onCancel, loading, isLandscape }) {
  const { isHebrew } = useLanguage();

  return (
    <View style={styles.container}>
      <AppTextInput
        label={i18n.t('commonName')}
        value={name}
        onChangeText={onChangeName}
        placeholder={i18n.t('apiKeysNamePlaceholder')}
        editable={!loading}
        forceLtr
      />
      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait, isLandscape && isHebrew && styles.rowRtl]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('apiKeysCreateFormAction')} onPress={onSubmit} loading={loading} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title={i18n.t('commonCancel')} onPress={onCancel} disabled={loading} variant="secondary" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  actions: {
    gap: 10,
  },
  actionsPortrait: {
    flexDirection: 'column',
  },
  actionsLandscape: {
    flexDirection: 'row',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  actionPortrait: {
    width: '100%',
  },
  actionLandscape: {
    flex: 1,
  },
});
