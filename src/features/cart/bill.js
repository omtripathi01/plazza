// calculateBill(): item total, discount, delivery fee and grand total. Pure, no React.
import {checkCoupon, findCoupon} from './coupons';

export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_MIN = 499;

// items: [{ price, qty, ... }] (already joined with the catalog)
export function itemTotalOf(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function calculateBill(items, couponCode, usedCodes = []) {
  const itemTotal = itemTotalOf(items);
  const isEmpty = items.length === 0;

  let couponDiscount = 0;
  let freeDelivery = false;
  if (couponCode && !isEmpty) {
    const result = checkCoupon(findCoupon(couponCode), itemTotal, usedCodes);
    if (result.ok) {
      couponDiscount = result.discount;
      freeDelivery = result.freeDelivery;
    }
  }

  let deliveryFee = 0;
  if (!isEmpty && itemTotal < FREE_DELIVERY_MIN) {
    deliveryFee = DELIVERY_FEE;
  }
  if (freeDelivery) {
    deliveryFee = 0;
  }

  const discount = Math.min(couponDiscount, itemTotal);
  const grandTotal = itemTotal - discount + deliveryFee;

  return {itemTotal, discount, deliveryFee, grandTotal};
}
