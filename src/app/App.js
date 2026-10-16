// App root: splash while saved data loads, then Login or the Home / Cart / Profile tabs.
import React, {Suspense, useEffect, useMemo, useState} from 'react';
import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from '../features/home/HomeScreen';
import CartScreen from '../features/cart/CartScreen';
import SplashScreen from '../shared/components/SplashScreen';
import {TAB_ICONS} from '../shared/components/TabIcon';
import {countItems} from '../features/cart/cart';
import {useAuthStore} from '../features/auth/authStore';
import {useCartStore} from '../features/cart/cartStore';
import {usePermissionStore} from '../features/permissions/permissionStore';
import {useSearchStore} from '../features/home/searchStore';
import {useColors, useThemeStore} from '../shared/theme/themeStore';
import {fontSize} from '../shared/theme/theme';

// Code split: Login and Profile are loaded only when first shown (Metro inline requires + React.lazy).
const LoginScreen = React.lazy(() => import('../features/auth/LoginScreen'));
const ProfileScreen = React.lazy(() =>
  import('../features/profile/ProfileScreen'),
);

const Tab = createBottomTabNavigator();
const MIN_SPLASH_MS = 1200;

// Tab button without the default Android ripple highlight.
function TabButton(props) {
  return (
    <Pressable
      {...props}
      android_ripple={null}
      style={[props.style, styles.tabButton]}
    />
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const colors = useColors();
  const mode = useThemeStore(s => s.mode);
  const user = useAuthStore(s => s.user);
  const guest = useAuthStore(s => s.guest);
  const items = useCartStore(s => s.items);
  const cartCount = countItems(items);

  // Navigation theme follows our palette so tab bar and backgrounds match.
  const navTheme = useMemo(() => {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [mode, colors]);

  // Load everything from storage before showing the tabs, so defaults never overwrite saved data.
  useEffect(() => {
    async function loadAll() {
      const minDelay = new Promise(resolve =>
        setTimeout(resolve, MIN_SPLASH_MS),
      );
      await Promise.all([
        useCartStore.getState().load(),
        useSearchStore.getState().load(),
        usePermissionStore.getState().load(),
        useThemeStore.getState().load(),
        useAuthStore.getState().load(),
        minDelay,
      ]);
      setReady(true);
    }
    loadAll();
  }, []);

  const statusBar = (
    <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
  );

  if (!ready) {
    return (
      <View style={styles.flex}>
        {statusBar}
        <SplashScreen />
      </View>
    );
  }

  if (!user && !guest) {
    return (
      <SafeAreaProvider>
        {statusBar}
        <Suspense fallback={<SplashScreen />}>
          <LoginScreen />
        </Suspense>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {statusBar}
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
            sceneStyle: {backgroundColor: colors.background},
            tabBarButton: TabButton,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.muted,
            tabBarLabelStyle: {fontSize: fontSize.tiny, fontWeight: '600'},
            tabBarStyle: {
              minHeight: 64,
              paddingBottom: 8,
              paddingTop: 6,
              backgroundColor: colors.card,
            },
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{tabBarIcon: TAB_ICONS.Home}}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarIcon: TAB_ICONS.Cart,
              tabBarBadge: cartCount > 0 ? cartCount : undefined,
            }}
          />
          <Tab.Screen name="Profile" options={{tabBarIcon: TAB_ICONS.Profile}}>
            {() => (
              <Suspense fallback={<View style={styles.flex} />}>
                <ProfileScreen />
              </Suspense>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  tabButton: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
