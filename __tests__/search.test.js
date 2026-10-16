import {addRecentSearch, searchMedicines} from '../src/features/home/search';
import {MEDICINES} from '../src/shared/data/catalog';

describe('searchMedicines', () => {
  test('finds by name, ignoring case and spaces', () => {
    const names = searchMedicines(MEDICINES, '  DOLO ').map(m => m.name);
    expect(names).toContain('Dolo 650');
  });

  test('finds by salt', () => {
    const names = searchMedicines(MEDICINES, 'paracetamol').map(m => m.name);
    expect(names).toContain('Dolo 650');
    expect(names).toContain('Crocin Advance');
  });

  test('empty query gives no results', () => {
    expect(searchMedicines(MEDICINES, '   ')).toEqual([]);
  });
});

describe('addRecentSearch', () => {
  test('newest first, max 5, no duplicates ignoring case', () => {
    let recent = [];
    for (const q of ['a', 'b', 'c', 'd', 'e', 'f']) {
      recent = addRecentSearch(recent, q);
    }
    expect(recent).toEqual(['f', 'e', 'd', 'c', 'b']);
    recent = addRecentSearch(recent, 'D');
    expect(recent).toEqual(['D', 'f', 'e', 'c', 'b']);
  });

  test('ignores blank queries', () => {
    expect(addRecentSearch(['x'], '  ')).toEqual(['x']);
  });
});
