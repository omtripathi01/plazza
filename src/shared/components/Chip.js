// Small rounded tappable chip, e.g. a recent search.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {Pressable, StyleSheet} from 'react-native';
import {useColors} from '../theme/themeStore';
import {fontSize, spacing} from '../theme/theme';

export default function Chip({label, onPress, accessibilityLabel}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      style={styles.chip}>
      <AppText style={styles.text}>{label}</AppText>
    </Pressable>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    chip: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      minHeight: 40,
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    text: {fontSize: fontSize.small, color: colors.text},
  });
}
