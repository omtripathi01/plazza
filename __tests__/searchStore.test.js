import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSearchStore} from '../src/features/home/searchStore';

jest.useFakeTimers();

beforeEach(async () => {
  await AsyncStorage.clear();
  useSearchStore.setState({
    query: '',
    results: [],
    status: 'empty',
    recentSearches: [],
    loaded: true,
    searchId: 0,
  });
});

describe('searchStore', () => {
  test('goes empty -> loading -> results', async () => {
    const promise = useSearchStore.getState().runSearch('dolo');
    expect(useSearchStore.getState().status).toBe('loading');
    jest.advanceTimersByTime(300);
    await promise;
    const state = useSearchStore.getState();
    expect(state.status).toBe('results');
    expect(state.results.map(m => m.name)).toEqual(['Dolo 650']);
  });

  test('no results state', async () => {
    const promise = useSearchStore.getState().runSearch('zzz');
    jest.advanceTimersByTime(300);
    await promise;
    expect(useSearchStore.getState().status).toBe('noResults');
  });

  test('blank query resets to empty', async () => {
    await useSearchStore.getState().runSearch('   ');
    expect(useSearchStore.getState().status).toBe('empty');
  });

  test('ignores stale results when a newer search starts', async () => {
    const first = useSearchStore.getState().runSearch('dolo');
    const second = useSearchStore.getState().runSearch('pan');
    jest.advanceTimersByTime(300);
    await Promise.all([first, second]);
    expect(useSearchStore.getState().results.map(m => m.name)).toEqual([
      'Pan 40',
    ]);
  });

  test('recent searches persist and reload', async () => {
    useSearchStore.getState().saveRecent('Dolo');
    useSearchStore.getState().saveRecent('dolo');
    useSearchStore.getState().saveRecent('Pan');
    expect(useSearchStore.getState().recentSearches).toEqual(['Pan', 'dolo']);
    await Promise.resolve();
    useSearchStore.setState({recentSearches: [], loaded: false});
    await useSearchStore.getState().load();
    expect(useSearchStore.getState().recentSearches).toEqual(['Pan', 'dolo']);
  });
});
