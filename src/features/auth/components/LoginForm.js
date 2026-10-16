// Name + phone + password form with per-field validation. Used by the Login screen and the cart prompt.
import React, {useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Input} from '../../../shared/components';
import {useAuthStore} from '../authStore';
import {digitsOnly} from '../validation';
import {useColors} from '../../../shared/theme/themeStore';
import {spacing} from '../../../shared/theme/theme';

export default function LoginForm({onSuccess}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const login = useAuthStore(s => s.login);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Clear a field's error as soon as the user edits it.
  function update(field, setter) {
    return value => {
      setter(field === 'phone' ? digitsOnly(value) : value);
      if (errors[field]) {
        setErrors({...errors, [field]: undefined});
      }
    };
  }

  function onLogin() {
    const result = login(name, phone, password);
    if (result.ok) {
      setErrors({});
      if (onSuccess) {
        onSuccess();
      }
      return;
    }
    setErrors(result.errors);
  }

  return (
    <>
      <Input
        label="Name"
        value={name}
        onChangeText={update('name', setName)}
        placeholder="Your name"
        autoCapitalize="words"
        error={errors.name}
        style={styles.field}
      />
      <Input
        label="Phone"
        value={phone}
        onChangeText={update('phone', setPhone)}
        placeholder="10 digit mobile number"
        keyboardType="number-pad"
        maxLength={10}
        error={errors.phone}
        style={styles.field}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={update('password', setPassword)}
        placeholder="Hint: 1111"
        secureTextEntry
        keyboardType="number-pad"
        maxLength={4}
        onSubmitEditing={onLogin}
        error={errors.password}
        style={styles.field}
      />
      <Button
        title="Log in"
        onPress={onLogin}
        accessibilityLabel="Log in"
        style={styles.button}
      />
    </>
  );
}

function getStyles() {
  return StyleSheet.create({
    field: {marginTop: spacing.sm},
    button: {marginTop: spacing.lg},
  });
}
