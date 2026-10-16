import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../src/features/auth/authStore';

beforeEach(async () => {
  await AsyncStorage.clear();
  useAuthStore.setState({user: null, guest: false, loaded: true});
});

describe('authStore', () => {
  test('rejects empty name, short phone and wrong password', () => {
    const {login} = useAuthStore.getState();
    expect(login('', '9876543210', '1111').ok).toBe(false);
    expect(login('Om', '98765', '1111').ok).toBe(false);
    expect(login('Om', '9876543210', '0000')).toEqual({
      ok: false,
      reason: 'Wrong password (hint: 1111)',
    });
    expect(useAuthStore.getState().user).toBeNull();
  });

  test('logs in with password 1111 and clears guest mode', () => {
    useAuthStore.getState().continueAsGuest();
    expect(useAuthStore.getState().guest).toBe(true);
    expect(useAuthStore.getState().login(' Om ', '9876543210', '1111').ok).toBe(
      true,
    );
    const state = useAuthStore.getState();
    expect(state.user).toEqual({name: 'Om', phone: '9876543210'});
    expect(state.guest).toBe(false);
    expect(state.isLoggedIn()).toBe(true);
  });

  test('logout clears user and guest', () => {
    useAuthStore.getState().login('Om', '9876543210', '1111');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().guest).toBe(false);
  });

  test('session survives a reload', async () => {
    useAuthStore.getState().login('Om', '9876543210', '1111');
    await Promise.resolve();
    useAuthStore.setState({user: null, guest: false, loaded: false});
    await useAuthStore.getState().load();
    expect(useAuthStore.getState().user).toEqual({
      name: 'Om',
      phone: '9876543210',
    });
  });
});
