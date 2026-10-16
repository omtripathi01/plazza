import {COUPONS, checkCoupon, findCoupon} from '../src/features/cart/coupons';

describe('coupons', () => {
  test('lists the 4 coupons from the catalog', () => {
    expect(COUPONS.map(c => c.code)).toEqual([
      'FLAT50',
      'SAVE10',
      'FREEDEL',
      'FIRST100',
    ]);
  });

  test('FLAT50: 299 invalid with reason, 300 gives 50 off', () => {
    const flat = findCoupon('FLAT50');
    expect(checkCoupon(flat, 299, [])).toEqual({
      ok: false,
      reason: 'Add ₹1 more',
    });
    expect(checkCoupon(flat, 300, [])).toEqual({
      ok: true,
      discount: 50,
      freeDelivery: false,
    });
  });

  test('SAVE10: 185 gives 18 off, 1500 capped at 100', () => {
    const save = findCoupon('SAVE10');
    expect(checkCoupon(save, 185, []).discount).toBe(18);
    expect(checkCoupon(save, 1500, []).discount).toBe(100);
  });

  test('FREEDEL: free delivery, zero discount', () => {
    expect(checkCoupon(findCoupon('FREEDEL'), 50, [])).toEqual({
      ok: true,
      discount: 0,
      freeDelivery: true,
    });
  });

  test('FIRST100: 199 invalid, 200 gives 100, used once only', () => {
    const first = findCoupon('FIRST100');
    expect(checkCoupon(first, 199, []).ok).toBe(false);
    expect(checkCoupon(first, 200, []).discount).toBe(100);
    expect(checkCoupon(first, 200, ['FIRST100'])).toEqual({
      ok: false,
      reason: 'Already used',
    });
  });

  test('empty cart: every coupon invalid', () => {
    for (const coupon of COUPONS) {
      expect(checkCoupon(coupon, 0, []).ok).toBe(false);
    }
  });
});

describe('removalMessage', () => {
  const {removalMessage} = require('../src/features/cart/coupons');
  test('names the coupon and its minimum', () => {
    expect(removalMessage(findCoupon('FLAT50'), {ok: false, reason: 'x'})).toBe(
      'FLAT50 removed. Minimum item total is ₹300.',
    );
  });
  test('uses the reason for coupons without a minimum', () => {
    expect(
      removalMessage(findCoupon('FREEDEL'), {
        ok: false,
        reason: 'Cart is empty',
      }),
    ).toBe('FREEDEL removed. Cart is empty');
  });
});
