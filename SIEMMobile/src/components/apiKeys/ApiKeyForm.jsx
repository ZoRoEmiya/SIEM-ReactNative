import { StyleSheet, View } from 'react-native';
import AppButton from '../common/AppButton';
import AppTextInput from '../common/AppTextInput';

export default function ApiKeyForm({ name, onChangeName, onSubmit, onCancel, loading }) {
  return (
    <View style={styles.container}>
      <AppTextInput
        label="Name"
        value={name}
        onChangeText={onChangeName}
        placeholder="prod, staging, web-server"
        editable={!loading}
      />
      <View style={styles.actions}>
        <AppButton title="Create" onPress={onSubmit} loading={loading} />
        <AppButton title="Cancel" onPress={onCancel} disabled={loading} variant="secondary" />
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
});
