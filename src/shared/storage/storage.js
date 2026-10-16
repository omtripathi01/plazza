// loadData() / saveData() wrap AsyncStorage with { version: 1, data } envelopes. They never throw:
// missing, broken, or wrong-version data returns the default value and logs a warning.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_VERSION = 1;

export const KEYS = {
  cart: 'cart',
  recentSearches: 'recentSearches',
  permissions: 'permissions',
  theme: 'theme',
  auth: 'auth',
};

export async function loadData(key, defaultValue) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) {
      return defaultValue;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION) {
      console.warn(`storage: wrong version for "${key}", using default`);
      return defaultValue;
    }
    return parsed.data;
  } catch (error) {
    console.warn(`storage: could not load "${key}"`, error);
    return defaultValue;
  }
}

export async function saveData(key, data) {
  try {
    const envelope = JSON.stringify({version: STORAGE_VERSION, data});
    await AsyncStorage.setItem(key, envelope);
  } catch (error) {
    console.warn(`storage: could not save "${key}"`, error);
  }
}
