// Small "Rx" badge shown for prescription medicines.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {StyleSheet, View} from 'react-native';
import {fontSize, spacing} from '../theme/theme';
import {useColors} from '../theme/themeStore';

export default function RxBadge() {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.badge} accessibilityLabel="Prescription required">
      <AppText style={styles.text}>Rx</AppText>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    badge: {
      backgroundColor: colors.rxBackground,
      borderRadius: 6,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      marginLeft: spacing.sm,
    },
    text: {color: colors.rxText, fontSize: fontSize.tiny, fontWeight: '700'},
  });
}
