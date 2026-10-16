// Centered title + message, with an optional action button.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {StyleSheet, View} from 'react-native';
import {fontSize, spacing} from '../theme/theme';
import {useColors} from '../theme/themeStore';
import Button from './Button';

export default function EmptyState({title, message, actionTitle, onAction}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>{title}</AppText>
      {message ? <AppText style={styles.message}>{message}</AppText> : null}
      {actionTitle ? (
        <Button title={actionTitle} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    wrap: {alignItems: 'center', padding: spacing.xl},
    title: {fontSize: fontSize.title, color: colors.text, fontWeight: '600'},
    message: {
      fontSize: fontSize.small,
      color: colors.muted,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    button: {marginTop: spacing.lg, alignSelf: 'stretch'},
  });
}
