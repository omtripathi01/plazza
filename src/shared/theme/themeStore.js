// Zustand store for the color theme ('light' | 'dark'). Saved so it survives restarts.
import {create} from 'zustand';
import {darkColors, lightColors} from './theme';
import {KEYS, loadData, saveData} from '../storage/storage';

export const useThemeStore = create((set, get) => ({
  mode: 'light',
  loaded: false,

  load: async () => {
    const saved = await loadData(KEYS.theme, 'light');
    set({mode: saved === 'dark' ? 'dark' : 'light', loaded: true});
  },

  toggle: () => {
    const mode = get().mode === 'dark' ? 'light' : 'dark';
    set({mode});
    saveData(KEYS.theme, mode);
  },
}));

// Hook used by every component to get the active palette.
export function useColors() {
  const mode = useThemeStore(s => s.mode);
  return mode === 'dark' ? darkColors : lightColors;
}
