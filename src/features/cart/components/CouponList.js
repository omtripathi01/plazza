// Lists every coupon with Apply / Applied (Remove) / disabled-with-reason. Knows no coupon codes.
import React, {useMemo} from 'react';
import AppText from '../../../shared/components/AppText';
import {StyleSheet, View} from 'react-native';
import {COUPONS, checkCoupon} from '../coupons';
import {fontSize, radius, shadow, spacing} from '../../../shared/theme/theme';
import {useColors} from '../../../shared/theme/themeStore';
import Bounce from '../../../shared/components/Bounce';
import Button from '../../../shared/components/Button';

export default function CouponList({
  itemTotal,
  usedCodes,
  appliedCoupon,
  onApply,
  onRemove,
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <AppText style={styles.title}>Coupons</AppText>
      {COUPONS.map(coupon => {
        const result = checkCoupon(coupon, itemTotal, usedCodes);
        const applied = appliedCoupon === coupon.code;
        let button;
        if (applied) {
          button = (
            <Bounce trigger={coupon.code}>
              <Button
                title="Applied (Remove)"
                variant="outline"
                onPress={onRemove}
                accessibilityLabel={`Remove coupon ${coupon.code}`}
              />
            </Bounce>
          );
        } else if (result.ok) {
          button = (
            <Button
              title="Apply"
              onPress={() => onApply(coupon.code)}
              accessibilityLabel={`Apply coupon ${coupon.code}`}
            />
          );
        } else {
          button = (
            <Button
              title={result.reason}
              disabled
              accessibilityLabel={`${coupon.code} unavailable: ${result.reason}`}
            />
          );
        }
        return (
          <View key={coupon.code} style={styles.row}>
            <View style={styles.info}>
              <AppText style={styles.code}>{coupon.code}</AppText>
              <AppText style={styles.desc}>{coupon.description}</AppText>
            </View>
            {button}
          </View>
        );
      })}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius,
      ...shadow,
      padding: spacing.md,
      marginTop: spacing.md,
    },
    title: {
      fontSize: fontSize.body,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    info: {flex: 1, marginRight: spacing.sm},
    code: {fontSize: fontSize.small, fontWeight: '700', color: colors.text},
    desc: {fontSize: fontSize.tiny, color: colors.muted, marginTop: 2},
  });
}
