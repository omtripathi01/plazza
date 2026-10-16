// Cart tab: items list, free-delivery nudge, coupons + bill in the footer, place-order button.
import React, {useMemo, useState} from 'react';
import AppText from '../../shared/components/AppText';
import {FlatList, StyleSheet, View, useWindowDimensions} from 'react-native';
import BillCard from './components/BillCard';
import Button from '../../shared/components/Button';
import CouponList from './components/CouponList';
import EmptyState from '../../shared/components/EmptyState';
import MedicineRow from '../../shared/components/MedicineRow';
import ScreenHeader from '../../shared/components/ScreenHeader';
import SuccessOverlay from '../../shared/components/SuccessOverlay';
import LoginModal from '../auth/components/LoginModal';
import {useAuthStore} from '../auth/authStore';
import {MEDICINES} from '../../shared/data/catalog';
import {FREE_DELIVERY_MIN, calculateBill} from './bill';
import {countItems, itemsWithDetails} from './cart';
import {useCartStore} from './cartStore';
import {useColors} from '../../shared/theme/themeStore';
import {
  fontSize,
  radius,
  spacing,
  maxContentWidth,
} from '../../shared/theme/theme';

export default function CartScreen({navigation}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const {width, height} = useWindowDimensions();
  const landscape = width > height;

  const items = useCartStore(s => s.items);
  const appliedCoupon = useCartStore(s => s.appliedCoupon);
  const usedCoupons = useCartStore(s => s.usedCoupons);
  const increment = useCartStore(s => s.increment);
  const decrement = useCartStore(s => s.decrement);
  const remove = useCartStore(s => s.remove);
  const applyCoupon = useCartStore(s => s.applyCoupon);
  const removeCoupon = useCartStore(s => s.removeCoupon);
  const placeOrder = useCartStore(s => s.placeOrder);

  // Holds the last order summary while the success overlay is shown.
  const [placed, setPlaced] = useState(null);
  // Guests must log in before an order is placed.
  const user = useAuthStore(s => s.user);
  const [askLogin, setAskLogin] = useState(false);

  // Join cart lines with the catalog and compute the bill. Logic lives in logic/, not here.
  const lines = useMemo(() => itemsWithDetails(items, MEDICINES), [items]);
  const bill = useMemo(
    () => calculateBill(lines, appliedCoupon, usedCoupons),
    [lines, appliedCoupon, usedCoupons],
  );
  const count = countItems(items);
  const moreForFreeDelivery = FREE_DELIVERY_MIN - bill.itemTotal;

  // Row enter / exit / reorder animations come from <FadeIn> inside MedicineRow (Reanimated).
  const onIncrement = increment;
  const onDecrement = decrement;
  const onRemove = remove;

  function confirmOrder() {
    setPlaced({total: bill.grandTotal, saved: bill.discount});
    placeOrder(bill);
  }

  function onPlaceOrder() {
    if (!user) {
      setAskLogin(true);
      return;
    }
    confirmOrder();
  }

  // After a successful login from the prompt, place the order straight away.
  function onLoginSuccess() {
    setAskLogin(false);
    confirmOrder();
  }

  const overlay = (
    <>
      <LoginModal
        visible={askLogin}
        onClose={() => setAskLogin(false)}
        onSuccess={onLoginSuccess}
      />
      <SuccessOverlay
        visible={placed !== null}
        title="Order placed!"
        message={
          placed
            ? `₹${placed.total} · on its way in 15 minutes.${
                placed.saved > 0 ? ` You saved ₹${placed.saved}.` : ''
              }`
            : ''
        }
        onClose={() => setPlaced(null)}
      />
    </>
  );

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Cart" subtitle="No items yet" />
        <EmptyState
          title="Your cart is empty"
          message="Add medicines from the Home tab."
          actionTitle="Search medicines"
          onAction={() => navigation.navigate('Home')}
        />
        {overlay}
      </View>
    );
  }

  const nudge =
    bill.deliveryFee > 0 && moreForFreeDelivery > 0 ? (
      <View style={styles.nudge}>
        <AppText
          style={
            styles.nudgeText
          }>{`Add ₹${moreForFreeDelivery} more for free delivery`}</AppText>
      </View>
    ) : (
      <View style={[styles.nudge, styles.nudgeSuccess]}>
        <AppText style={[styles.nudgeText, styles.nudgeSuccessText]}>
          🎉 You get free delivery
        </AppText>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Cart"
        subtitle={`${count} item${count === 1 ? '' : 's'}`}
      />
      <FlatList
        data={lines}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={nudge}
        renderItem={({item}) => (
          <MedicineRow
            medicine={item}
            qty={item.qty}
            showLineTotal
            onIncrement={() => onIncrement(item.id)}
            onDecrement={() => onDecrement(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        )}
        ListFooterComponent={
          <View>
            <CouponList
              itemTotal={bill.itemTotal}
              usedCodes={usedCoupons}
              appliedCoupon={appliedCoupon}
              onApply={applyCoupon}
              onRemove={removeCoupon}
            />
            <BillCard bill={bill} />
          </View>
        }
      />
      <View style={[styles.footer, landscape && styles.footerCompact]}>
        <View style={styles.footerText}>
          <AppText style={styles.footerLabel}>Grand Total</AppText>
          <AppText style={styles.footerTotal}>{`₹${bill.grandTotal}`}</AppText>
          {bill.discount > 0 ? (
            <AppText
              style={
                styles.footerSaved
              }>{`You save ₹${bill.discount}`}</AppText>
          ) : null}
        </View>
        <Button
          title="Place order"
          onPress={onPlaceOrder}
          accessibilityLabel={`Place order for ${bill.grandTotal} rupees`}
          style={styles.footerButton}
        />
      </View>
      {overlay}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    list: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center',
    },
    nudge: {
      backgroundColor: colors.warningLight,
      borderRadius: radius,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    nudgeText: {
      color: colors.warningText,
      fontSize: fontSize.small,
      fontWeight: '600',
    },
    nudgeSuccess: {backgroundColor: colors.successLight},
    nudgeSuccessText: {color: colors.success},
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerCompact: {paddingVertical: spacing.sm},
    footerText: {flex: 1, marginRight: spacing.md},
    footerLabel: {fontSize: fontSize.tiny, color: colors.muted},
    footerTotal: {
      fontSize: fontSize.title,
      fontWeight: '800',
      color: colors.text,
    },
    footerSaved: {fontSize: fontSize.tiny, color: colors.success},
    footerButton: {flex: 1},
  });
}
