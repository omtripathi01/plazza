// Generic surface card: themed background, radius and shadow. Wrap any content block in it.
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useColors} from '../theme/themeStore';
import {radius, shadow, spacing} from '../theme/theme';

export default function Card({children, style, padded = true}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {backgroundColor: colors.card, borderRadius: radius, ...shadow},
    padded: {padding: spacing.md},
  });
}
