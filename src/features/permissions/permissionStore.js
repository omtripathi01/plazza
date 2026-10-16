// Zustand store for Location + Notification permissions and the device location.
// Android check() never reports "blocked", so the last known status is saved and merged in.
import {create} from 'zustand';
import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  PERMISSIONS,
  checkMultiple,
  checkNotifications,
  requestMultiple,
  requestNotifications,
} from 'react-native-permissions';
import {locationStatusFrom, resolveStatus} from './permissionStatus';
import {getPlaceName} from '../../shared/services/geocode';
import {KEYS, loadData, saveData} from '../../shared/storage/storage';

const FINE = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
const COARSE = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;

const DEFAULT_SAVED = {
  location: 'denied',
  notifications: 'denied',
  askedOnFirstLaunch: false,
};

Geolocation.setRNConfiguration({skipPermissionRequests: true});

export const usePermissionStore = create((set, get) => ({
  location: 'denied',
  notifications: 'denied',
  askedOnFirstLaunch: false,
  coords: null, // { latitude, longitude }
  placeName: null, // e.g. "Connaught Place, New Delhi"
  locationError: null,
  loaded: false,

  load: async () => {
    const saved = await loadData(KEYS.permissions, DEFAULT_SAVED);
    set({...DEFAULT_SAVED, ...saved, loaded: true});
    await get().checkAll();
  },

  persist: () => {
    const {location, notifications, askedOnFirstLaunch, loaded} = get();
    if (!loaded) {
      return;
    }
    saveData(KEYS.permissions, {location, notifications, askedOnFirstLaunch});
  },

  // Check both permissions and keep "blocked" if that is what we saw last time.
  checkAll: async () => {
    if (Platform.OS !== 'android') {
      return;
    }
    const loc = await checkMultiple([FINE, COARSE]);
    const notif = await checkNotifications();
    // Read the last known status only now: a request() that just finished may have set "blocked"
    // while we were awaiting, and check() alone can never report "blocked" on Android.
    const prev = get();
    const location = resolveStatus(
      locationStatusFrom(loc[FINE], loc[COARSE]),
      prev.location,
    );
    const notifications = resolveStatus(notif.status, prev.notifications);
    set({location, notifications});
    get().persist();
    if (location === 'granted') {
      get().fetchLocation();
    }
  },

  requestLocation: async () => {
    const result = await requestMultiple([FINE, COARSE]);
    const location = locationStatusFrom(result[FINE], result[COARSE]);
    set({location});
    get().persist();
    if (location === 'granted') {
      get().fetchLocation();
    }
    return location;
  },

  requestNotifications: async () => {
    const result = await requestNotifications([]);
    set({notifications: result.status});
    get().persist();
    return result.status;
  },

  // First launch only: ask Location, then Notifications.
  askOnFirstLaunch: async () => {
    if (get().askedOnFirstLaunch) {
      return;
    }
    set({askedOnFirstLaunch: true});
    get().persist();
    await get().requestLocation();
    await get().requestNotifications();
  },

  fetchLocation: () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        set({coords: {latitude, longitude}, locationError: null});
        const placeName = await getPlaceName(latitude, longitude);
        set({placeName});
      },
      () => set({coords: null, locationError: 'Location unavailable'}),
      {enableHighAccuracy: false, timeout: 15000},
    );
  },
}));
