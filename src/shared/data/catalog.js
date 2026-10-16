// Loads catalog.json and exports the medicine list and raw coupon definitions.
// Shape of a medicine: { id, name, salt, price, rx, maxQty }.
import catalogJson from './catalog.json';

export const MEDICINES = catalogJson.medicines;
export const COUPON_DEFINITIONS = catalogJson.coupons || [];

export function findMedicine(id) {
  return MEDICINES.find(m => m.id === id);
}
