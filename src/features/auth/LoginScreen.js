// Login screen: branding + LoginForm + "Continue as guest".
import React, {useMemo} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppText, Button, Card} from '../../shared/components';
import LoginForm from './components/LoginForm';
import {useAuthStore} from './authStore';
import {useColors} from '../../shared/theme/themeStore';
import {fontSize, spacing, maxContentWidth} from '../../shared/theme/theme';

export default function LoginScreen() {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const continueAsGuest = useAuthStore(s => s.continueAsGuest);
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <AppText style={styles.logoText}>P</AppText>
        </View>
        <AppText style={styles.brand}>Welcome to Plazza</AppText>
        <AppText style={styles.tagline}>
          Log in to order medicines in minutes
        </AppText>

        <Card style={styles.card}>
          <LoginForm />
        </Card>

        <Button
          title="Continue as guest"
          variant="outline"
          onPress={continueAsGuest}
          accessibilityLabel="Continue as guest"
          style={styles.guestWrap}
          buttonStyle={styles.guest}
          textStyle={styles.guestText}
        />
        <AppText style={styles.guestNote}>
          Guests can browse and build a cart. Log in when you place an order.
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.primary},
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.xl,
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center',
    },
    logo: {
      width: 72,
      height: 72,
      borderRadius: 20,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    logoText: {fontSize: 40, fontWeight: '800', color: colors.primary},
    brand: {
      fontSize: fontSize.title + 4,
      fontWeight: '800',
      color: colors.white,
      textAlign: 'center',
      marginTop: spacing.lg,
    },
    tagline: {
      fontSize: fontSize.small,
      color: colors.primaryLight,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    card: {padding: spacing.lg},
    guestWrap: {marginTop: spacing.lg},
    guest: {borderColor: colors.white, backgroundColor: 'transparent'},
    guestText: {color: colors.white},
    guestNote: {
      fontSize: fontSize.tiny,
      color: colors.primaryLight,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });
}
