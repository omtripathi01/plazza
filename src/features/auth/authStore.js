// Zustand store for the mock login. Any name + phone works; the password is always "1111".
// A user can also continue as guest; guests can browse and fill the cart but must log in to place an order.
import {create} from 'zustand';
import {KEYS, loadData, saveData} from '../../shared/storage/storage';

export const MOCK_PASSWORD = '1111';

export const useAuthStore = create((set, get) => ({
  user: null, // { name, phone }
  guest: false, // true when the user chose "Continue as guest"
  loaded: false,

  load: async () => {
    const saved = await loadData(KEYS.auth, null);
    set({
      user: saved && saved.user && saved.user.name ? saved.user : null,
      guest: Boolean(saved && saved.guest),
      loaded: true,
    });
  },

  persist: () => {
    const {user, guest} = get();
    saveData(KEYS.auth, {user, guest});
  },

  // Returns { ok: true } or { ok: false, reason }.
  login: (name, phone, password) => {
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').trim();
    if (!cleanName) {
      return {ok: false, reason: 'Enter your name'};
    }
    if (cleanPhone.length < 10) {
      return {ok: false, reason: 'Enter a 10 digit phone number'};
    }
    if (password !== MOCK_PASSWORD) {
      return {ok: false, reason: 'Wrong password (hint: 1111)'};
    }
    set({user: {name: cleanName, phone: cleanPhone}, guest: false});
    get().persist();
    return {ok: true};
  },

  continueAsGuest: () => {
    set({user: null, guest: true});
    get().persist();
  },

  logout: () => {
    set({user: null, guest: false});
    get().persist();
  },

  isLoggedIn: () => Boolean(get().user),
}));
