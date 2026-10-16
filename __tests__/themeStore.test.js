import AsyncStorage from '@react-native-async-storage/async-storage';
import {useThemeStore} from '../src/shared/theme/themeStore';

beforeEach(async () => {
  await AsyncStorage.clear();
  useThemeStore.setState({mode: 'light', loaded: true});
});

describe('themeStore', () => {
  test('toggles between light and dark and persists', async () => {
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().mode).toBe('dark');
    await Promise.resolve();
    useThemeStore.setState({mode: 'light', loaded: false});
    await useThemeStore.getState().load();
    expect(useThemeStore.getState().mode).toBe('dark');
  });

  test('unknown saved value falls back to light', async () => {
    await AsyncStorage.setItem(
      'theme',
      JSON.stringify({version: 1, data: 'blue'}),
    );
    await useThemeStore.getState().load();
    expect(useThemeStore.getState().mode).toBe('light');
  });
});
