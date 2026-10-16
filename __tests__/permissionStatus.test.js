import {
  locationStatusFrom,
  resolveStatus,
} from '../src/features/permissions/permissionStatus';

describe('resolveStatus', () => {
  test('keeps blocked when check says denied but it was blocked before', () => {
    expect(resolveStatus('denied', 'blocked')).toBe('blocked');
  });
  test('otherwise trusts the checked value', () => {
    expect(resolveStatus('granted', 'blocked')).toBe('granted');
    expect(resolveStatus('denied', 'denied')).toBe('denied');
    expect(resolveStatus('denied', undefined)).toBe('denied');
  });
});

describe('locationStatusFrom', () => {
  test('either fine or coarse granted counts as granted', () => {
    expect(locationStatusFrom('denied', 'granted')).toBe('granted');
    expect(locationStatusFrom('granted', 'denied')).toBe('granted');
  });
  test('blocked when any is blocked', () => {
    expect(locationStatusFrom('blocked', 'denied')).toBe('blocked');
  });
  test('denied otherwise', () => {
    expect(locationStatusFrom('denied', 'denied')).toBe('denied');
  });
});
