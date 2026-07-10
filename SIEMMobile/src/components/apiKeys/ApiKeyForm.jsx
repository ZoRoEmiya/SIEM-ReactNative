import { StyleSheet, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';

export default function ApiKeyForm({ name, onChangeName, onSubmit, onCancel, loading, isLandscape }) {
  return (
    <View style={styles.container}>
      <AppTextInput
        label="Name"
        value={name}
        onChangeText={onChangeName}
        placeholder="prod, staging, web-server"
        editable={!loading}
      />
      <View style={[styles.actions, isLandscape ? styles.actionsLandscape : styles.actionsPortrait]}>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Create" onPress={onSubmit} loading={loading} />
        </View>
        <View style={isLandscape ? styles.actionLandscape : styles.actionPortrait}>
          <AppButton title="Cancel" onPress={onCancel} disabled={loading} variant="secondary" />
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
  actionPortrait: {
    width: '100%',
  },
  actionLandscape: {
    flex: 1,
  },
});
