// Single text component for the whole app. Keeps font family, sizes, weights and colors consistent.
// Usage: <AppText variant="title">...</AppText>. Variants: hero, title, body, small, tiny, label.
import React, {useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useColors} from '../theme/themeStore';
import {fontSize} from '../theme/theme';

export default function AppText({
  variant = 'body',
  muted,
  bold,
  style,
  children,
  ...props
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <Text
      {...props}
      style={[
        styles.base,
        styles[variant],
        muted && styles.muted,
        bold && styles.bold,
        style,
      ]}>
      {children}
    </Text>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    base: {
      color: colors.text,
      fontSize: fontSize.body,
    },
    hero: {
      fontSize: fontSize.hero,
      fontWeight: '800',
    },
    title: {
      fontSize: fontSize.title,
      fontWeight: '700',
    },
    body: {fontSize: fontSize.body},
    small: {fontSize: fontSize.small},
    tiny: {fontSize: fontSize.tiny},
    label: {fontSize: fontSize.tiny, color: colors.muted},
    muted: {color: colors.muted},
    bold: {fontWeight: '700'},
  });
}
