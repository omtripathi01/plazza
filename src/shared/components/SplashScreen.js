// Branded splash shown while saved data loads. Fades the logo in.
import React, {useEffect, useRef} from 'react';
import AppText from './AppText';
import {ActivityIndicator, Animated, StyleSheet, View} from 'react-native';
import {colors, fontSize, spacing} from '../theme/theme';

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.center, {opacity}]}>
        <View style={styles.logo}>
          <AppText style={styles.logoText}>P</AppText>
        </View>
        <AppText style={styles.brand}>Plazza</AppText>
        <AppText style={styles.tagline}>Medicines delivered in minutes</AppText>
      </Animated.View>
      <ActivityIndicator color={colors.white} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {alignItems: 'center'},
  logo: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {fontSize: 48, fontWeight: '800', color: colors.primary},
  brand: {fontSize: fontSize.hero, fontWeight: '800', color: colors.white},
  tagline: {
    fontSize: fontSize.small,
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },
  spinner: {position: 'absolute', bottom: 64},
});
