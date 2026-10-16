// Bottom-sheet style modal with a short description of one medicine and an Add / stepper control.
import React, {useMemo} from 'react';
import AppText from '../../../shared/components/AppText';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../../../shared/components/Button';
import QtyStepper from '../../../shared/components/QtyStepper';
import RxBadge from '../../../shared/components/RxBadge';
import {useColors} from '../../../shared/theme/themeStore';
import {fontSize, radius, spacing} from '../../../shared/theme/theme';

export default function MedicineDetailModal({
  medicine,
  qty,
  onClose,
  onAdd,
  onIncrement,
  onDecrement,
}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const visible = Boolean(medicine);
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Close details">
        <Pressable
          style={[styles.sheet, {paddingBottom: insets.bottom + spacing.xl}]}
          onPress={() => {}}>
          {medicine ? (
            <View>
              <View style={styles.handle} />
              <View style={styles.titleRow}>
                <AppText style={styles.name}>{medicine.name}</AppText>
                {medicine.rx ? <RxBadge /> : null}
              </View>
              <AppText style={styles.salt}>{medicine.salt}</AppText>
              <AppText style={styles.description}>
                {medicine.description}
              </AppText>
              <View style={styles.metaRow}>
                <AppText style={styles.price}>{`₹${medicine.price}`}</AppText>
                <AppText
                  style={
                    styles.meta
                  }>{`Max ${medicine.maxQty} per order`}</AppText>
              </View>
              {medicine.rx ? (
                <AppText style={styles.rxNote}>
                  Prescription medicine. Keep your prescription ready at
                  delivery.
                </AppText>
              ) : null}
              <View style={styles.actions}>
                {qty > 0 ? (
                  <QtyStepper
                    name={medicine.name}
                    qty={qty}
                    maxQty={medicine.maxQty}
                    onIncrement={onIncrement}
                    onDecrement={onDecrement}
                  />
                ) : (
                  <Button
                    title="Add to cart"
                    onPress={onAdd}
                    accessibilityLabel={`Add ${medicine.name} to cart`}
                    style={styles.addButton}
                  />
                )}
              </View>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: spacing.lg,
    },
    titleRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
    name: {fontSize: fontSize.title, fontWeight: '800', color: colors.text},
    salt: {fontSize: fontSize.small, color: colors.muted, marginTop: 2},
    description: {
      fontSize: fontSize.body,
      color: colors.text,
      lineHeight: 24,
      marginTop: spacing.md,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    price: {fontSize: fontSize.title, fontWeight: '700', color: colors.primary},
    meta: {fontSize: fontSize.small, color: colors.muted},
    rxNote: {
      fontSize: fontSize.tiny,
      color: colors.rxText,
      backgroundColor: colors.rxBackground,
      borderRadius: radius,
      padding: spacing.sm,
      marginTop: spacing.md,
    },
    actions: {marginTop: spacing.lg, alignItems: 'flex-end'},
    addButton: {alignSelf: 'stretch'},
  });
}
