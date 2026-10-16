// Bold section heading used above lists and card groups.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {StyleSheet} from 'react-native';
import {useColors} from '../theme/themeStore';
import {fontSize, spacing} from '../theme/theme';

export default function SectionTitle({children, style}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return <AppText style={[styles.title, style]}>{children}</AppText>;
}

function getStyles(colors) {
  return StyleSheet.create({
    title: {
      fontSize: fontSize.small,
      fontWeight: '700',
      color: colors.text,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
  });
}
