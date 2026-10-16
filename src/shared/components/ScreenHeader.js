// Brand-colored header used at the top of each tab.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fontSize, spacing} from '../theme/theme';
import {useColors} from '../theme/themeStore';

// `tall` adds extra bottom space so a card (like the Home search box) can overlap the header.
export default function ScreenHeader({title, subtitle, right, tall}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const landscape = width > height;
  return (
    <View
      style={[
        styles.header,
        {paddingTop: insets.top + (landscape ? spacing.xs : spacing.md)},
        tall && styles.tall,
        landscape && styles.landscape,
      ]}>
      <View style={styles.textWrap}>
        <AppText style={styles.title}>{title}</AppText>
        {subtitle ? (
          <AppText style={styles.subtitle}>{subtitle}</AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    tall: {paddingBottom: spacing.xl + spacing.lg},
    landscape: {
      paddingBottom: spacing.xl,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    textWrap: {flex: 1},
    title: {
      fontSize: fontSize.title + 4,
      fontWeight: '800',
      color: colors.white,
    },
    subtitle: {
      fontSize: fontSize.small,
      color: colors.primaryLight,
      marginTop: 2,
    },
  });
}
