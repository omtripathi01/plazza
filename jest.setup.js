// Jest setup: mock AsyncStorage and the toast wrapper so store tests run without a device.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('./src/shared/services/toast', () => ({showToast: jest.fn()}));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
