// "− qty +" stepper. The + button is disabled and shows "Max N" at maxQty.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {Pressable, StyleSheet, View} from 'react-native';
import {fontSize, minButtonHeight, radius, spacing} from '../theme/theme';
import {useColors} from '../theme/themeStore';

export default function QtyStepper({
  name,
  qty,
  maxQty,
  onIncrement,
  onDecrement,
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const atMax = qty >= maxQty;
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${name} quantity`}
        onPress={onDecrement}
        style={styles.button}>
        <AppText style={styles.sign}>−</AppText>
      </Pressable>
      <AppText style={styles.qty}>{qty}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${name} quantity`}
        accessibilityState={{disabled: atMax}}
        disabled={atMax}
        onPress={onIncrement}
        style={[styles.button, atMax && styles.disabled]}>
        <AppText style={styles.sign}>{atMax ? `Max ${maxQty}` : '+'}</AppText>
      </Pressable>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    row: {flexDirection: 'row', alignItems: 'center'},
    button: {
      minHeight: minButtonHeight,
      minWidth: minButtonHeight,
      paddingHorizontal: spacing.sm,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabled: {opacity: 0.5},
    sign: {color: colors.primary, fontSize: fontSize.small, fontWeight: '700'},
    qty: {
      minWidth: 32,
      textAlign: 'center',
      fontSize: fontSize.body,
      color: colors.text,
      fontWeight: '600',
    },
  });
}
