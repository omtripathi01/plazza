// Tiny wrapper around ToastAndroid so stores can show messages and tests can mock it.
import {Platform, ToastAndroid} from 'react-native';

export function showToast(message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    console.log('toast:', message);
  }
}
