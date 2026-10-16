// Profile tab: user details, delivery location, dark mode switch, past orders, and logout.
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Switch, View} from 'react-native';
import {AppText, Button, Card, ScreenHeader} from '../../shared/components';
import {useAuthStore} from '../auth/authStore';
import {useCartStore} from '../cart/cartStore';
import {usePermissionStore} from '../permissions/permissionStore';
import {useColors, useThemeStore} from '../../shared/theme/themeStore';
import {fontSize, spacing, maxContentWidth} from '../../shared/theme/theme';

function initialsOf(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const isGuest = !user;
  const mode = useThemeStore(s => s.mode);
  const toggleTheme = useThemeStore(s => s.toggle);
  const placeName = usePermissionStore(s => s.placeName);
  const coords = usePermissionStore(s => s.coords);
  const location = usePermissionStore(s => s.location);
  const notifications = usePermissionStore(s => s.notifications);
  const orders = useCartStore(s => s.orders);

  const locationText =
    placeName || (coords ? 'Your current location' : 'Not available');

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" subtitle={user ? user.phone : 'Guest'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>
                {isGuest ? '?' : initialsOf(user.name)}
              </AppText>
            </View>
            <View style={styles.flex}>
              <AppText style={styles.name}>
                {isGuest ? 'Guest' : user.name}
              </AppText>
              <AppText style={styles.muted}>
                {isGuest ? 'Log in to place orders' : `+91 ${user.phone}`}
              </AppText>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Settings</AppText>
          <View style={styles.row}>
            <View style={styles.flex}>
              <AppText style={styles.itemTitle}>Dark mode</AppText>
              <AppText style={styles.muted}>
                {mode === 'dark' ? 'On' : 'Off'}
              </AppText>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{true: colors.primary, false: colors.border}}
              thumbColor={colors.white}
              accessibilityLabel="Toggle dark mode"
            />
          </View>
          <View style={styles.divider} />
          <AppText style={styles.itemTitle}>Delivery location</AppText>
          <AppText style={styles.muted}>{locationText}</AppText>
          <View style={styles.divider} />
          <AppText style={styles.itemTitle}>Permissions</AppText>
          <AppText
            style={
              styles.muted
            }>{`Location: ${location} · Notifications: ${notifications}`}</AppText>
        </Card>

        <Card style={styles.card}>
          <AppText
            style={
              styles.sectionTitle
            }>{`Past orders (${orders.length})`}</AppText>
          {orders.length === 0 ? (
            <AppText style={styles.muted}>No orders yet.</AppText>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderRow}>
                <View style={styles.flex}>
                  <AppText style={styles.itemTitle}>{`${order.itemCount} item${
                    order.itemCount === 1 ? '' : 's'
                  }`}</AppText>
                  <AppText style={styles.muted}>
                    {new Date(order.date).toLocaleString()}
                    {order.coupon ? ` · ${order.coupon}` : ''}
                  </AppText>
                </View>
                <AppText style={styles.orderTotal}>{`₹${order.total}`}</AppText>
              </View>
            ))
          )}
        </Card>

        <Button
          title={isGuest ? 'Log in' : 'Log out'}
          variant={isGuest ? 'primary' : 'danger'}
          onPress={logout}
          accessibilityLabel={isGuest ? 'Log in' : 'Log out'}
        />
        <AppText style={styles.version}>Plazza · v0.0.1</AppText>
      </ScrollView>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    scroll: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center',
    },
    flex: {flex: 1},
    card: {padding: spacing.lg, marginBottom: spacing.md},
    row: {flexDirection: 'row', alignItems: 'center'},
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    avatarText: {
      fontSize: fontSize.title,
      fontWeight: '800',
      color: colors.primary,
    },
    name: {fontSize: fontSize.title, fontWeight: '700', color: colors.text},
    muted: {fontSize: fontSize.small, color: colors.muted, marginTop: 2},
    sectionTitle: {
      fontSize: fontSize.body,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    itemTitle: {fontSize: fontSize.body, color: colors.text},
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.md,
    },
    orderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    orderTotal: {
      fontSize: fontSize.body,
      fontWeight: '700',
      color: colors.text,
    },
    version: {
      textAlign: 'center',
      color: colors.muted,
      fontSize: fontSize.tiny,
      marginTop: spacing.lg,
    },
  });
}
