// The coupon list and checkCoupon(). Each coupon is one object with a check(itemTotal) function.
// Adding a coupon = adding one object to COUPONS (or one entry in catalog.json). Nothing else changes.
import {COUPON_DEFINITIONS} from '../../shared/data/catalog';

// Builds the check() function for one coupon definition from catalog.json.
function buildCheck(def) {
  if (def.type === 'flat') {
    return itemTotal => {
      if (itemTotal < def.minItemTotal) {
        const missing = def.minItemTotal - itemTotal;
        return {ok: false, reason: `Add ₹${missing} more`};
      }
      return {ok: true, discount: def.amount, freeDelivery: false};
    };
  }
  if (def.type === 'percent') {
    return itemTotal => {
      const raw = Math.floor((itemTotal * def.percent) / 100);
      return {
        ok: true,
        discount: Math.min(raw, def.maxDiscount),
        freeDelivery: false,
      };
    };
  }
  if (def.type === 'freeDelivery') {
    return () => ({ok: true, discount: 0, freeDelivery: true});
  }
  return () => ({ok: false, reason: 'Unknown coupon type'});
}

export const COUPONS = COUPON_DEFINITIONS.map(def => ({
  code: def.code,
  description: def.description,
  oneTimeUse: Boolean(def.oneTimeUse),
  minItemTotal: def.minItemTotal || 0,
  check: buildCheck(def),
}));

export function findCoupon(code) {
  return COUPONS.find(c => c.code === code);
}

// Order of checks: empty cart -> already used -> coupon's own rule.
export function checkCoupon(coupon, itemTotal, usedCodes) {
  if (!coupon) {
    return {ok: false, reason: 'Unknown coupon'};
  }
  if (itemTotal <= 0) {
    return {ok: false, reason: 'Cart is empty'};
  }
  if (coupon.oneTimeUse && usedCodes.includes(coupon.code)) {
    return {ok: false, reason: 'Already used'};
  }
  return coupon.check(itemTotal);
}

// Message shown in the toast when a coupon is auto-removed after a cart change.
export function removalMessage(coupon, result) {
  if (coupon.minItemTotal > 0) {
    return `${coupon.code} removed. Minimum item total is ₹${coupon.minItemTotal}.`;
  }
  return `${coupon.code} removed. ${result.reason}`;
}
