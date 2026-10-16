// Zustand store for search: query, results, loading state and saved recent searches.
import {create} from 'zustand';
import {MEDICINES} from '../../shared/data/catalog';
import {addRecentSearch, searchMedicinesAsync} from './search';
import {KEYS, loadData, saveData} from '../../shared/storage/storage';

// 'empty' | 'loading' | 'noResults' | 'results'
export const useSearchStore = create((set, get) => ({
  query: '',
  results: [],
  status: 'empty',
  recentSearches: [],
  loaded: false,
  searchId: 0,

  load: async () => {
    const recentSearches = await loadData(KEYS.recentSearches, []);
    set({
      recentSearches: Array.isArray(recentSearches) ? recentSearches : [],
      loaded: true,
    });
  },

  setQuery: query => set({query}),

  // Runs the (delayed) search. Ignores stale results if the query changed meanwhile.
  runSearch: async query => {
    const trimmed = (query || '').trim();
    if (!trimmed) {
      set({results: [], status: 'empty'});
      return;
    }
    const id = get().searchId + 1;
    set({status: 'loading', searchId: id});
    const results = await searchMedicinesAsync(MEDICINES, trimmed);
    if (get().searchId !== id) {
      return;
    }
    set({results, status: results.length ? 'results' : 'noResults'});
  },

  // Saves a search (keyboard submit, add-to-cart, or recent tap).
  saveRecent: query => {
    const next = addRecentSearch(get().recentSearches, query);
    set({recentSearches: next});
    if (get().loaded) {
      saveData(KEYS.recentSearches, next);
    }
  },

  clear: () => set({query: '', results: [], status: 'empty'}),
}));
