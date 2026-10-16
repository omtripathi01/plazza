import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCartStore} from '../src/features/cart/cartStore';
import {showToast} from '../src/shared/services/toast';
import {MEDICINES} from '../src/shared/data/catalog';
import {itemsWithDetails} from '../src/features/cart/cart';
import {calculateBill} from '../src/features/cart/bill';

// Catalog ids: m8 Augmentin 200 (maxQty 2), m1 Dolo 30 (maxQty 5)
const reset = () =>
  useCartStore.setState({
    items: [],
    appliedCoupon: null,
    usedCoupons: [],
    loaded: true,
  });

const bill = () => {
  const {items, appliedCoupon, usedCoupons} = useCartStore.getState();
  return calculateBill(
    itemsWithDetails(items, MEDICINES),
    appliedCoupon,
    usedCoupons,
  );
};

beforeEach(async () => {
  await AsyncStorage.clear();
  showToast.mockClear();
  reset();
});

describe('cartStore', () => {
  test('auto-removes FLAT50 and shows a toast when total drops below 300', () => {
    const store = useCartStore.getState();
    store.addItem('m8'); // 200
    store.addItem('m1'); // 230
    store.addItem('m1'); // 260
    store.addItem('m1'); // 290
    store.addItem('m1'); // 320
    expect(store.applyCoupon('FLAT50').ok).toBe(true);
    expect(useCartStore.getState().appliedCoupon).toBe('FLAT50');

    store.decrement('m1'); // 290
    expect(useCartStore.getState().appliedCoupon).toBeNull();
    expect(showToast).toHaveBeenCalledTimes(1);
    expect(showToast.mock.calls[0][0]).toContain('FLAT50');
  });

  test('maxQty cap: increments stop at maxQty', () => {
    const store = useCartStore.getState();
    store.addItem('m8');
    store.increment('m8');
    store.increment('m8');
    expect(useCartStore.getState().items).toEqual([{id: 'm8', qty: 2}]);
  });

  test('only one coupon at a time', () => {
    const store = useCartStore.getState();
    store.addItem('m8');
    store.addItem('m8'); // 400
    expect(store.applyCoupon('FLAT50').ok).toBe(true);
    expect(store.applyCoupon('SAVE10').ok).toBe(true);
    expect(useCartStore.getState().appliedCoupon).toBe('SAVE10');
  });

  test('FIRST100 is marked used after placeOrder and cannot be applied again', () => {
    const store = useCartStore.getState();
    store.addItem('m8'); // 200
    expect(store.applyCoupon('FIRST100').ok).toBe(true);
    expect(bill().discount).toBe(100);
    store.placeOrder();
    const state = useCartStore.getState();
    expect(state.items).toEqual([]);
    expect(state.appliedCoupon).toBeNull();
    expect(state.usedCoupons).toEqual(['FIRST100']);

    store.addItem('m8');
    expect(store.applyCoupon('FIRST100')).toEqual({
      ok: false,
      reason: 'Already used',
    });
  });

  test('cart persists and loads back with cleaning', async () => {
    const store = useCartStore.getState();
    store.addItem('m1');
    await Promise.resolve();
    useCartStore.setState({items: [], loaded: false});
    await useCartStore.getState().load();
    expect(useCartStore.getState().items).toEqual([{id: 'm1', qty: 1}]);
  });
});
