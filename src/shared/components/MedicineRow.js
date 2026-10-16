// One medicine in search results or the cart: name, Rx badge, salt, price, and Add / stepper / Remove.
import React, {useMemo} from 'react';
import AppText from './AppText';
import {Pressable, StyleSheet, View} from 'react-native';
import {fontSize, radius, shadow, spacing} from '../theme/theme';
import {useColors} from '../theme/themeStore';
import Button from './Button';
import FadeIn from './FadeIn';
import QtyStepper from './QtyStepper';
import RxBadge from './RxBadge';

function MedicineRow({
  medicine,
  qty,
  onAdd,
  onIncrement,
  onDecrement,
  onRemove,
  onPress,
  showLineTotal,
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const inCart = qty > 0;
  return (
    <FadeIn style={styles.card}>
      <Pressable
        style={styles.info}
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={
          onPress ? `Show details for ${medicine.name}` : undefined
        }>
        <View style={styles.nameRow}>
          <AppText style={styles.name}>{medicine.name}</AppText>
          {medicine.rx ? <RxBadge /> : null}
        </View>
        <AppText style={styles.salt}>{medicine.salt}</AppText>
        <AppText style={styles.price}>
          {showLineTotal
            ? `₹${medicine.price} × ${qty} = ₹${medicine.price * qty}`
            : `₹${medicine.price}`}
        </AppText>
      </Pressable>
      <View style={styles.actions}>
        {inCart ? (
          <QtyStepper
            name={medicine.name}
            qty={qty}
            maxQty={medicine.maxQty}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ) : (
          <Button
            title="Add"
            onPress={onAdd}
            accessibilityLabel={`Add ${medicine.name} to cart`}
          />
        )}
        {onRemove ? (
          <Button
            title="Remove"
            variant="outline"
            onPress={onRemove}
            accessibilityLabel={`Remove ${medicine.name} from cart`}
            style={styles.remove}
          />
        ) : null}
      </View>
    </FadeIn>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius,
      ...shadow,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    info: {flex: 1, marginRight: spacing.sm, minWidth: 140},
    nameRow: {flexDirection: 'row', alignItems: 'center'},
    name: {fontSize: fontSize.body, color: colors.text, fontWeight: '600'},
    salt: {fontSize: fontSize.tiny, color: colors.muted, marginTop: 2},
    price: {
      fontSize: fontSize.small,
      color: colors.text,
      marginTop: spacing.xs,
    },
    actions: {alignItems: 'flex-end'},
    remove: {marginTop: spacing.sm, minHeight: 40},
  });
}

// Memoized: a row only re-renders when its medicine or qty changes.
export default React.memo(MedicineRow);
