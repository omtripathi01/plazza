// Shared button: 48 dp tall, primary / outline / danger variants, accessible, with a press-scale animation.
import React, {useMemo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import AppText from './AppText';
import {useColors} from '../theme/themeStore';
import {fontSize, minButtonHeight, radius, spacing} from '../theme/theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  accessibilityLabel,
  style,
  buttonStyle,
  textStyle,
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  // Press feedback: scale down slightly while pressed (Reanimated, runs on the UI thread).
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  function pressIn() {
    scale.value = withSpring(0.96);
  }
  function pressOut() {
    scale.value = withSpring(1, {damping: 8});
  }

  return (
    <Animated.View style={[pressStyle, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{disabled: Boolean(disabled)}}
        disabled={disabled}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={[
          styles.base,
          styles[variant],
          disabled && styles.disabled,
          buttonStyle,
        ]}>
        <AppText
          style={[
            styles.text,
            variant === 'outline' && styles.outlineText,
            textStyle,
          ]}>
          {title}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    base: {
      minHeight: minButtonHeight,
      borderRadius: radius,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {backgroundColor: colors.primary},
    danger: {backgroundColor: colors.danger},
    outline: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    disabled: {opacity: 0.5},
    text: {color: colors.white, fontSize: fontSize.body, fontWeight: '600'},
    outlineText: {color: colors.primary},
  });
}
