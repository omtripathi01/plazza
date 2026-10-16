// Bottom-sheet login prompt shown when a guest tries to place an order.
import React, {useMemo} from 'react';
import AppText from '../../../shared/components/AppText';
import {KeyboardAvoidingView, Modal, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LoginForm from './LoginForm';
import {useColors} from '../../../shared/theme/themeStore';
import {fontSize, spacing} from '../../../shared/theme/theme';

export default function LoginModal({visible, onClose, onSuccess}) {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="slide"
      onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.flex} behavior="height">
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close login">
          <Pressable
            style={[styles.sheet, {paddingBottom: insets.bottom + spacing.xl}]}
            onPress={() => {}}>
            <AppText style={styles.title}>Log in to place your order</AppText>
            <AppText style={styles.subtitle}>
              Your cart is saved. Log in and we will place the order right away.
            </AppText>
            <LoginForm onSuccess={onSuccess} />
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    flex: {flex: 1},
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
    },
    title: {fontSize: fontSize.title, fontWeight: '800', color: colors.text},
    subtitle: {
      fontSize: fontSize.small,
      color: colors.muted,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
  });
}
