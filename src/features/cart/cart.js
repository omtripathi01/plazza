// Pure cart functions. A cart is an array of { id, qty }. Quantities are capped at medicine.maxQty.
// No React, no storage here, so these are easy to test.

export function getQty(items, id) {
  const line = items.find(item => item.id === id);
  return line ? line.qty : 0;
}

// Sets the quantity for one medicine. qty <= 0 removes the line; qty > maxQty is capped.
export function setQty(items, medicine, qty) {
  const safeQty = Math.min(qty, medicine.maxQty);
  if (safeQty <= 0) {
    return items.filter(item => item.id !== medicine.id);
  }
  const exists = items.some(item => item.id === medicine.id);
  if (!exists) {
    return [...items, {id: medicine.id, qty: safeQty}];
  }
  return items.map(item =>
    item.id === medicine.id ? {...item, qty: safeQty} : item,
  );
}

export function addItem(items, medicine) {
  return setQty(items, medicine, getQty(items, medicine.id) + 1);
}

export function incrementItem(items, medicine) {
  return addItem(items, medicine);
}

export function decrementItem(items, medicine) {
  return setQty(items, medicine, getQty(items, medicine.id) - 1);
}

export function removeItem(items, id) {
  return items.filter(item => item.id !== id);
}

export function countItems(items) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

// Joins cart lines with the catalog so the UI gets name, price, etc.
// Lines whose id is not in the catalog are dropped, and qty is capped at maxQty.
export function cleanCart(items, medicines) {
  const result = [];
  for (const item of items) {
    const medicine = medicines.find(m => m.id === item.id);
    if (!medicine) {
      continue;
    }
    const qty = Math.min(Math.max(1, Math.floor(item.qty)), medicine.maxQty);
    if (Number.isFinite(qty)) {
      result.push({id: item.id, qty});
    }
  }
  return result;
}

export function itemsWithDetails(items, medicines) {
  return items
    .map(item => {
      const medicine = medicines.find(m => m.id === item.id);
      return medicine ? {...medicine, qty: item.qty} : null;
    })
    .filter(Boolean);
}
