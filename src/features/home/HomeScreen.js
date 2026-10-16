// Home tab: delivery card, debug banner, permission cards, search box, and search results.
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  AppText,
  Card,
  Chip,
  EmptyState,
  Input,
  MedicineRow,
  ScreenHeader,
  SectionTitle,
} from '../../shared/components';
import HealthTips from './components/HealthTips';
import MedicineDetailModal from './components/MedicineDetailModal';
import PermissionBanner from '../permissions/components/PermissionBanner';
import {MEDICINES} from '../../shared/data/catalog';
import {getQty} from '../cart/cart';
import {useCartStore} from '../cart/cartStore';
import {usePermissionStore} from '../permissions/permissionStore';
import {useSearchStore} from './searchStore';
import {showToast} from '../../shared/services/toast';
import {
  fontSize,
  shadow,
  spacing,
  maxContentWidth,
} from '../../shared/theme/theme';
import {useColors} from '../../shared/theme/themeStore';

const DEBOUNCE_MS = 250;

export default function HomeScreen() {
  const colors = useColors();
  const styles = useMemo(() => getStyles(colors), [colors]);
  // permissions
  const location = usePermissionStore(s => s.location);
  const notifications = usePermissionStore(s => s.notifications);
  const coords = usePermissionStore(s => s.coords);
  const placeName = usePermissionStore(s => s.placeName);
  const locationError = usePermissionStore(s => s.locationError);
  const askOnFirstLaunch = usePermissionStore(s => s.askOnFirstLaunch);
  const requestLocation = usePermissionStore(s => s.requestLocation);
  const requestNotifications = usePermissionStore(s => s.requestNotifications);
  const checkAll = usePermissionStore(s => s.checkAll);

  // search
  const query = useSearchStore(s => s.query);
  const results = useSearchStore(s => s.results);
  const status = useSearchStore(s => s.status);
  const recentSearches = useSearchStore(s => s.recentSearches);
  const setQuery = useSearchStore(s => s.setQuery);
  const runSearch = useSearchStore(s => s.runSearch);
  const saveRecent = useSearchStore(s => s.saveRecent);
  const clearSearch = useSearchStore(s => s.clear);

  // cart
  const items = useCartStore(s => s.items);
  const addItem = useCartStore(s => s.addItem);
  const increment = useCartStore(s => s.increment);
  const decrement = useCartStore(s => s.decrement);

  const [text, setText] = useState(query);
  const [selected, setSelected] = useState(null); // medicine shown in the detail modal
  const debounceRef = useRef(null);

  // First launch: ask for permissions. Later launches only check.
  useEffect(() => {
    askOnFirstLaunch();
  }, [askOnFirstLaunch]);

  // Re-check permissions when the user comes back from Settings.
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkAll();
      }
    });
    return () => sub.remove();
  }, [checkAll]);

  // Debounce typing by 250 ms, then run the search.
  function onChangeText(value) {
    setText(value);
    setQuery(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => runSearch(value), DEBOUNCE_MS);
  }

  function onSubmit() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    runSearch(text);
    saveRecent(text);
  }

  function onRecentPress(value) {
    setText(value);
    setQuery(value);
    runSearch(value);
    saveRecent(value);
  }

  function onClear() {
    setText('');
    clearSearch();
  }

  function onAdd(medicine) {
    addItem(medicine.id);
    showToast(`${medicine.name} added to cart`);
    if (text.trim()) {
      saveRecent(text);
    }
  }

  // Delivery line: place name if we have it, else coordinates, else a status message.
  let deliveryTitle = 'Location permission needed';
  let deliverySubtitle = 'Allow location to see where we deliver.';
  if (coords) {
    deliveryTitle = placeName || 'Your current location';
    deliverySubtitle = 'Delivery in 15 min';
  } else if (location === 'granted') {
    deliveryTitle = locationError || 'Finding your location…';
    deliverySubtitle = 'Using approximate location';
  }

  // Stable renderItem so FlatList rows only re-render when their own props change.
  const renderItem = useCallback(
    ({item}) => (
      <MedicineRow
        medicine={item}
        qty={getQty(items, item.id)}
        onAdd={() => onAdd(item)}
        onIncrement={() => increment(item.id)}
        onDecrement={() => decrement(item.id)}
        onPress={() => setSelected(item)}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, increment, decrement, text],
  );

  // Empty search shows the whole catalog so the user can browse.
  const showBrowse = status === 'empty';
  const listData = status === 'results' ? results : showBrowse ? MEDICINES : [];

  function renderListHeader() {
    return (
      <View>
        <Card style={styles.deliveryCard}>
          <AppText style={styles.pin}>📍</AppText>
          <View style={styles.deliveryText}>
            <AppText style={styles.deliveryLabel}>Delivering to</AppText>
            <AppText style={styles.deliveryTitle} numberOfLines={1}>
              {deliveryTitle}
            </AppText>
            <AppText style={styles.deliverySubtitle} numberOfLines={1}>
              {deliverySubtitle}
            </AppText>
          </View>
        </Card>

        <AppText style={styles.debug}>
          {`DEBUG · Location: ${location} · Notifications: ${notifications}`}
        </AppText>

        {location !== 'granted' ? (
          <PermissionBanner
            title="Location"
            status={location}
            reason="We use your location to show where your order will be delivered."
            onAllow={requestLocation}
          />
        ) : null}
        {notifications !== 'granted' ? (
          <PermissionBanner
            title="Notifications"
            status={notifications}
            reason="We use notifications to tell you about order updates."
            onAllow={requestNotifications}
          />
        ) : null}

        {showBrowse && recentSearches.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle>Recent searches</SectionTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map(item => (
                <Chip
                  key={item}
                  label={`🕘 ${item}`}
                  accessibilityLabel={`Search again for ${item}`}
                  onPress={() => onRecentPress(item)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {status === 'loading' ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
            <AppText style={styles.loadingText}>Searching…</AppText>
          </View>
        ) : null}
        {status === 'noResults' ? (
          <EmptyState
            title="No medicines found"
            message={`Nothing matches "${text.trim()}". Try a salt name like "Paracetamol".`}
          />
        ) : null}
        {status === 'results' ? (
          <SectionTitle>{`${results.length} result${
            results.length === 1 ? '' : 's'
          }`}</SectionTitle>
        ) : null}
        {showBrowse ? <HealthTips /> : null}
        {showBrowse ? <SectionTitle>All medicines</SectionTitle> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Plazza"
        subtitle="Medicines delivered in minutes"
        tall
      />

      <View style={styles.searchOuter}>
        <Input
          icon="🔍"
          value={text}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          onClear={onClear}
          placeholder="Search by name or salt"
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search medicines"
          style={styles.searchWrap}
          inputStyle={styles.searchInput}
        />
      </View>

      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={renderListHeader()}
        renderItem={renderItem}
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={styles.list}
      />

      <MedicineDetailModal
        medicine={selected}
        qty={selected ? getQty(items, selected.id) : 0}
        onClose={() => setSelected(null)}
        onAdd={() => onAdd(selected)}
        onIncrement={() => increment(selected.id)}
        onDecrement={() => decrement(selected.id)}
      />
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: colors.background},
    searchWrap: {
      marginHorizontal: spacing.lg,
      marginTop: -spacing.xl,
      ...shadow,
    },
    searchInput: {minHeight: 52},
    list: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
      width: '100%',
      maxWidth: maxContentWidth,
      alignSelf: 'center',
    },
    deliveryCard: {flexDirection: 'row', alignItems: 'center'},
    pin: {fontSize: 24, marginRight: spacing.md},
    deliverySubtitle: {
      fontSize: fontSize.tiny,
      color: colors.success,
      marginTop: 2,
    },
    debug: {
      fontSize: fontSize.tiny,
      color: colors.muted,
      backgroundColor: colors.border,
      borderRadius: 6,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginVertical: spacing.sm,
    },
    section: {marginTop: spacing.sm},
    center: {alignItems: 'center', padding: spacing.xl},
    loadingText: {
      color: colors.muted,
      marginTop: spacing.sm,
      fontSize: fontSize.small,
    },
  });
}
