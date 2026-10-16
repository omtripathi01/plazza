// Name + phone + password form. Used by the Login screen and by the login prompt in the cart.
import React, {useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {AppText, Button, Input} from '../../../shared/components';
import {useAuthStore} from '../authStore';
import {useColors} from '../../../shared/theme/themeStore';
import {fontSize, spacing} from '../../../shared/theme/theme';

export default function LoginForm({onSuccess}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const login = useAuthStore(s => s.login);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function onLogin() {
    const result = login(name, phone, password);
    setError(result.ok ? '' : result.reason);
    if (result.ok && onSuccess) {
      onSuccess();
    }
  }

  return (
    <>
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={styles.field}
      />
      <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        placeholder="10 digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        style={styles.field}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Hint: 1111"
        secureTextEntry
        keyboardType="number-pad"
        maxLength={4}
        onSubmitEditing={onLogin}
        style={styles.field}
      />
      {error ? <AppText style={styles.error}>{error}</AppText> : null}
      <Button
        title="Log in"
        onPress={onLogin}
        accessibilityLabel="Log in"
        style={styles.button}
      />
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    field: {marginTop: spacing.sm},
    error: {
      color: colors.danger,
      fontSize: fontSize.small,
      marginTop: spacing.sm,
    },
    button: {marginTop: spacing.lg},
  });
}
