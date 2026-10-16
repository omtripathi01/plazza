import {
  addItem,
  cleanCart,
  countItems,
  decrementItem,
  incrementItem,
  removeItem,
} from '../src/features/cart/cart';

const dolo = {id: 'm1', name: 'Dolo 650', price: 30, maxQty: 3};
const pan = {id: 'm5', name: 'Pan 40', price: 150, maxQty: 2};

describe('cart logic', () => {
  test('add past maxQty stays at maxQty', () => {
    let items = [];
    items = addItem(items, dolo);
    items = incrementItem(items, dolo);
    items = incrementItem(items, dolo);
    items = incrementItem(items, dolo);
    expect(items).toEqual([{id: 'm1', qty: 3}]);
  });

  test('decrement to 0 removes the item', () => {
    let items = addItem([], dolo);
    items = decrementItem(items, dolo);
    expect(items).toEqual([]);
  });

  test('remove and count', () => {
    let items = addItem(addItem([], dolo), pan);
    expect(countItems(items)).toBe(2);
    items = removeItem(items, 'm1');
    expect(items).toEqual([{id: 'm5', qty: 1}]);
  });

  test('cleanCart drops unknown ids and caps qty', () => {
    const saved = [
      {id: 'm1', qty: 99},
      {id: 'ghost', qty: 1},
    ];
    expect(cleanCart(saved, [dolo, pan])).toEqual([{id: 'm1', qty: 3}]);
  });
});
