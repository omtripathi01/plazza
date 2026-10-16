// Full-screen "order placed" celebration: a springing check mark plus falling confetti.
// Built with the built-in Animated API, no extra libraries.
import React, {useEffect, useMemo, useRef} from 'react';
import AppText from './AppText';
import {
  Animated,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Button from './Button';
import {useColors} from '../theme/themeStore';
import {fontSize, spacing} from '../theme/theme';

const CONFETTI_COLORS = [
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#10B981',
  '#A855F7',
  '#EC4899',
];
const CONFETTI_COUNT = 24;

function ConfettiPiece({index, width, height}) {
  const progress = useRef(new Animated.Value(0)).current;
  const startX = (index / CONFETTI_COUNT) * width;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800 + (index % 5) * 250,
      delay: (index % 7) * 90,
      useNativeDriver: true,
    }).start();
  }, [progress, index]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, height],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, index % 2 ? 30 : -30, 0],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '540deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.confetti,
        {
          left: startX,
          backgroundColor: color,
          transform: [{translateY}, {translateX}, {rotate}],
        },
      ]}
    />
  );
}

export default function SuccessOverlay({visible, title, message, onClose}) {
  const colors = useColors();
  const themed = useMemo(() => getStyles(colors), [colors]);
  const {width, height} = useWindowDimensions();
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      scale.setValue(0);
      fade.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {toValue: 1, duration: 400, useNativeDriver: true}),
    ]).start();
  }, [visible, scale, fade]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={themed.backdrop}>
        {Array.from({length: CONFETTI_COUNT}).map((_, i) => (
          <ConfettiPiece key={i} index={i} width={width} height={height} />
        ))}
        <Animated.View style={[themed.card, {opacity: fade}]}>
          <Animated.View style={[themed.check, {transform: [{scale}]}]}>
            <AppText style={themed.checkText}>✓</AppText>
          </Animated.View>
          <AppText style={themed.title}>{title}</AppText>
          <AppText style={themed.message}>{message}</AppText>
          <Button
            title="Done"
            onPress={onClose}
            accessibilityLabel="Close order confirmation"
            style={themed.button}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 16,
    borderRadius: 3,
  },
});

function getStyles(colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.xl,
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    check: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.successLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    checkText: {fontSize: 44, fontWeight: '800', color: colors.success},
    title: {
      fontSize: fontSize.title,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    message: {
      fontSize: fontSize.small,
      color: colors.muted,
      textAlign: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    button: {alignSelf: 'stretch'},
  });
}
