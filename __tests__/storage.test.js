import AsyncStorage from '@react-native-async-storage/async-storage';
import {KEYS, loadData, saveData} from '../src/shared/storage/storage';

beforeEach(() => {
  AsyncStorage.clear();
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('storage', () => {
  test('missing data returns the default', async () => {
    expect(await loadData(KEYS.cart, {items: []})).toEqual({items: []});
  });

  test('broken JSON returns the default without throwing', async () => {
    await AsyncStorage.setItem(KEYS.cart, '{not json');
    expect(await loadData(KEYS.cart, 'fallback')).toBe('fallback');
  });

  test('wrong version returns the default', async () => {
    await AsyncStorage.setItem(
      KEYS.cart,
      JSON.stringify({version: 0, data: 'old'}),
    );
    expect(await loadData(KEYS.cart, 'fallback')).toBe('fallback');
  });

  test('a cart saves and loads back', async () => {
    const cart = {
      items: [{id: 'm1', qty: 2}],
      appliedCoupon: 'FLAT50',
      usedCoupons: [],
    };
    await saveData(KEYS.cart, cart);
    expect(await loadData(KEYS.cart, null)).toEqual(cart);
  });
});
