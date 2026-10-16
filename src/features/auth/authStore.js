// Zustand store for the mock login. Any name + phone works; the password is always "1111".
// A user can also continue as guest; guests can browse and fill the cart but must log in to place an order.
import {create} from 'zustand';
import {KEYS, loadData, saveData} from '../../shared/storage/storage';
import {MOCK_PASSWORD, digitsOnly, isValid, validateLogin} from './validation';

export {MOCK_PASSWORD};

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

  // Returns { ok: true } or { ok: false, errors, reason } where errors has one message per field.
  login: (name, phone, password) => {
    const errors = validateLogin({name, phone, password});
    if (!isValid(errors)) {
      return {ok: false, errors, reason: Object.values(errors)[0]};
    }
    set({user: {name: name.trim(), phone: digitsOnly(phone)}, guest: false});
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
