import {calculateBill} from '../src/features/cart/bill';

const line = (price, qty = 1) => ({id: String(price), price, qty});

describe('calculateBill', () => {
  test('delivery fee: 498 -> 40, 499 -> 0, empty -> 0', () => {
    expect(calculateBill([line(498)], null).deliveryFee).toBe(40);
    expect(calculateBill([line(499)], null).deliveryFee).toBe(0);
    expect(calculateBill([], null).deliveryFee).toBe(0);
  });

  test('empty cart has no bill', () => {
    expect(calculateBill([], 'FLAT50')).toEqual({
      itemTotal: 0,
      discount: 0,
      deliveryFee: 0,
      grandTotal: 0,
    });
  });

  test('FLAT50 at 300', () => {
    expect(calculateBill([line(300)], 'FLAT50')).toEqual({
      itemTotal: 300,
      discount: 50,
      deliveryFee: 40,
      grandTotal: 290,
    });
  });

  test('FREEDEL: delivery 0, discount stays 0', () => {
    const bill = calculateBill([line(100)], 'FREEDEL');
    expect(bill.deliveryFee).toBe(0);
    expect(bill.discount).toBe(0);
    expect(bill.grandTotal).toBe(100);
  });

  test('discount never exceeds item total', () => {
    // A coupon that passes its own check but would give more than the total.
    const bill = calculateBill([line(100, 2)], 'FIRST100');
    expect(bill.discount).toBeLessThanOrEqual(bill.itemTotal);
    expect(bill.discount).toBe(100);
    expect(bill.grandTotal).toBe(140);
  });

  test('invalid coupon gives no discount', () => {
    expect(calculateBill([line(100)], 'FLAT50').discount).toBe(0);
    expect(calculateBill([line(200)], 'FIRST100', ['FIRST100']).discount).toBe(
      0,
    );
  });
});

describe('bill edge cases', () => {
  test('FREEDEL on an already free cart stays applied but saves nothing', () => {
    const bill = calculateBill([line(600)], 'FREEDEL');
    expect(bill).toEqual({
      itemTotal: 600,
      discount: 0,
      deliveryFee: 0,
      grandTotal: 600,
    });
  });

  test('SAVE10 cap and whole-rupee rounding', () => {
    expect(calculateBill([line(185)], 'SAVE10').discount).toBe(18);
    expect(calculateBill([line(1500)], 'SAVE10').discount).toBe(100);
  });

  test('order history is recorded with total and coupon', () => {
    const {useCartStore} = require('../src/features/cart/cartStore');
    useCartStore.setState({
      items: [{id: 'm8', qty: 1}],
      appliedCoupon: 'SAVE10',
      usedCoupons: [],
      orders: [],
      loaded: true,
    });
    useCartStore.getState().placeOrder({grandTotal: 220});
    const [order] = useCartStore.getState().orders;
    expect(order.total).toBe(220);
    expect(order.coupon).toBe('SAVE10');
    expect(order.itemCount).toBe(1);
  });
});
