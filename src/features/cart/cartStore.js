// Zustand store for the cart: items, applied coupon, used coupons. Connects logic + storage + toast.
// Every cart change goes through recheckCoupon(), which drops a coupon that no longer qualifies.
import {create} from 'zustand';
import {MEDICINES, findMedicine} from '../../shared/data/catalog';
import * as cartLogic from './cart';
import {itemTotalOf} from './bill';
import {checkCoupon, findCoupon, removalMessage} from './coupons';
import {KEYS, loadData, saveData} from '../../shared/storage/storage';
import {showToast} from '../../shared/services/toast';

const DEFAULT_CART = {
  items: [],
  appliedCoupon: null,
  usedCoupons: [],
  orders: [],
};

export const useCartStore = create((set, get) => ({
  items: [],
  appliedCoupon: null,
  usedCoupons: [],
  orders: [], // past mock orders, newest first
  loaded: false,

  // Loads the saved cart, cleans it against the catalog, then turns saving on.
  load: async () => {
    const saved = await loadData(KEYS.cart, DEFAULT_CART);
    const items = cartLogic.cleanCart(saved.items || [], MEDICINES);
    set({
      items,
      appliedCoupon: saved.appliedCoupon || null,
      usedCoupons: saved.usedCoupons || [],
      orders: saved.orders || [],
      loaded: true,
    });
    get().recheckCoupon();
  },

  // Called after every change. Saves and re-validates the coupon.
  afterChange: () => {
    get().recheckCoupon();
    get().persist();
  },

  persist: () => {
    const {items, appliedCoupon, usedCoupons, orders, loaded} = get();
    if (!loaded) {
      return;
    }
    saveData(KEYS.cart, {items, appliedCoupon, usedCoupons, orders});
  },

  recheckCoupon: () => {
    const {items, appliedCoupon, usedCoupons} = get();
    if (!appliedCoupon) {
      return;
    }
    const coupon = findCoupon(appliedCoupon);
    const itemTotal = itemTotalOf(cartLogic.itemsWithDetails(items, MEDICINES));
    const result = checkCoupon(coupon, itemTotal, usedCoupons);
    if (!result.ok) {
      set({appliedCoupon: null});
      showToast(coupon ? removalMessage(coupon, result) : 'Coupon removed.');
    }
  },

  addItem: id => {
    const medicine = findMedicine(id);
    if (!medicine) {
      return;
    }
    set({items: cartLogic.addItem(get().items, medicine)});
    get().afterChange();
  },

  increment: id => {
    const medicine = findMedicine(id);
    if (!medicine) {
      return;
    }
    set({items: cartLogic.incrementItem(get().items, medicine)});
    get().afterChange();
  },

  decrement: id => {
    const medicine = findMedicine(id);
    if (!medicine) {
      return;
    }
    set({items: cartLogic.decrementItem(get().items, medicine)});
    get().afterChange();
  },

  remove: id => {
    set({items: cartLogic.removeItem(get().items, id)});
    get().afterChange();
  },

  // Applying a coupon replaces any previous one. Returns the check result for the UI.
  applyCoupon: code => {
    const {items, usedCoupons} = get();
    const coupon = findCoupon(code);
    const itemTotal = itemTotalOf(cartLogic.itemsWithDetails(items, MEDICINES));
    const result = checkCoupon(coupon, itemTotal, usedCoupons);
    if (result.ok) {
      set({appliedCoupon: code});
      get().persist();
    }
    return result;
  },

  removeCoupon: () => {
    set({appliedCoupon: null});
    get().persist();
  },

  // Mock order: records it, marks a one-time coupon as used, then clears the cart and coupon.
  placeOrder: bill => {
    const {items, appliedCoupon, usedCoupons, orders} = get();
    const coupon = appliedCoupon ? findCoupon(appliedCoupon) : null;
    let nextUsed = usedCoupons;
    if (coupon && coupon.oneTimeUse && !usedCoupons.includes(coupon.code)) {
      nextUsed = [...usedCoupons, coupon.code];
    }
    const order = {
      id: `ORD${Date.now()}`,
      date: new Date().toISOString(),
      itemCount: cartLogic.countItems(items),
      total: bill ? bill.grandTotal : 0,
      coupon: appliedCoupon,
    };
    set({
      items: [],
      appliedCoupon: null,
      usedCoupons: nextUsed,
      orders: [order, ...orders],
    });
    get().persist();
  },
}));
