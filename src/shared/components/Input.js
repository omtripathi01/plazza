// Generic text input with optional label, leading icon and clear button. Themed and 48 dp tall.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useColors} from '../theme/themeStore';
import {fontSize, minButtonHeight, radius, spacing} from '../theme/theme';

export default function Input({
  label,
  icon,
  onClear,
  style,
  inputStyle,
  ...props
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const showClear = Boolean(onClear && props.value);
  return (
    <View style={style}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <View style={styles.row}>
        {icon ? <AppText style={styles.icon}>{icon}</AppText> : null}
        <TextInput
          placeholderTextColor={colors.muted}
          accessibilityLabel={
            props.accessibilityLabel || label || props.placeholder
          }
          {...props}
          style={[styles.input, inputStyle]}
        />
        {showClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Clear ${
              label || props.placeholder || 'input'
            }`}
            onPress={onClear}
            style={styles.clear}>
            <AppText style={styles.clearText}>✕</AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    label: {
      fontSize: fontSize.tiny,
      color: colors.muted,
      marginBottom: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius,
      paddingHorizontal: spacing.md,
      minHeight: minButtonHeight,
    },
    icon: {fontSize: fontSize.body, marginRight: spacing.sm},
    input: {
      flex: 1,
      fontSize: fontSize.body,
      color: colors.text,
      minHeight: minButtonHeight,
    },
    clear: {
      minHeight: 40,
      minWidth: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clearText: {color: colors.muted, fontSize: fontSize.body},
  });
}
