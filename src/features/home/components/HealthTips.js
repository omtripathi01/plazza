// Horizontal strip of health tip cards for the Home tab.
import React, {useMemo} from 'react';
import AppText from '../../../shared/components/AppText';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {HEALTH_TIPS} from '../healthTips';
import {useColors} from '../../../shared/theme/themeStore';
import {fontSize, radius, shadow, spacing} from '../../../shared/theme/theme';

function HealthTips() {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const {width} = useWindowDimensions();
  // Cards are 60% of the screen width, capped, so two are visible on phones and more on tablets.
  const cardWidth = Math.min(240, Math.max(170, Math.round(width * 0.6)));
  return (
    <View style={styles.wrap}>
      <AppText style={styles.title}>Healthy tips</AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {HEALTH_TIPS.map(tip => (
          <View
            key={tip.id}
            style={[styles.card, {width: cardWidth}]}
            accessibilityLabel={`${tip.title}. ${tip.text}`}>
            <AppText style={styles.icon}>{tip.icon}</AppText>
            <AppText style={styles.cardTitle}>{tip.title}</AppText>
            <AppText style={styles.cardText} numberOfLines={3}>
              {tip.text}
            </AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default React.memo(HealthTips);

function getStyles(colors) {
  return StyleSheet.create({
    wrap: {marginTop: spacing.md},
    title: {
      fontSize: fontSize.small,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    scroll: {paddingVertical: spacing.xs, paddingRight: spacing.lg},
    card: {
      minHeight: 120,
      backgroundColor: colors.primaryLight,
      borderRadius: radius,
      padding: spacing.md,
      marginRight: spacing.sm,
      ...shadow,
    },
    icon: {fontSize: 24, marginBottom: spacing.xs},
    cardTitle: {
      fontSize: fontSize.small,
      fontWeight: '700',
      color: colors.text,
    },
    cardText: {fontSize: fontSize.tiny, color: colors.muted, marginTop: 2},
  });
}
