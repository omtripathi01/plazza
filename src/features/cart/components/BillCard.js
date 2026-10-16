// Shows the bill lines: Item Total, Discount, Delivery Fee, Grand Total.
import React, {useMemo} from 'react';
import AppText from '../../../shared/components/AppText';
import {StyleSheet, View} from 'react-native';
import {fontSize, radius, shadow, spacing} from '../../../shared/theme/theme';
import {useColors} from '../../../shared/theme/themeStore';

function Line({label, value, bold, styles}) {
  return (
    <View style={styles.line}>
      <AppText style={[styles.label, bold && styles.bold]}>{label}</AppText>
      <AppText style={[styles.value, bold && styles.bold]}>{value}</AppText>
    </View>
  );
}

export default function BillCard({bill}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <AppText style={styles.title}>Bill</AppText>
      <Line styles={styles} label="Item Total" value={`₹${bill.itemTotal}`} />
      <Line styles={styles} label="Discount" value={`− ₹${bill.discount}`} />
      <Line
        styles={styles}
        label="Delivery Fee"
        value={bill.deliveryFee === 0 ? 'Free' : `₹${bill.deliveryFee}`}
      />
      <View style={styles.divider} />
      <Line
        styles={styles}
        label="Grand Total"
        value={`₹${bill.grandTotal}`}
        bold
      />
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
    line: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
    },
    label: {fontSize: fontSize.small, color: colors.muted},
    value: {fontSize: fontSize.small, color: colors.text},
    bold: {fontWeight: '700', color: colors.text, fontSize: fontSize.body},
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
    },
  });
}
