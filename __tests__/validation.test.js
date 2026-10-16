import {
  digitsOnly,
  isValid,
  validateLogin,
} from '../src/features/auth/validation';

describe('validateLogin', () => {
  test('valid input gives no errors', () => {
    const errors = validateLogin({
      name: 'Om',
      phone: '9876543210',
      password: '1111',
    });
    expect(errors).toEqual({});
    expect(isValid(errors)).toBe(true);
  });

  test('reports every invalid field at once', () => {
    const errors = validateLogin({name: '', phone: '', password: ''});
    expect(errors).toEqual({
      name: 'Enter your name',
      phone: 'Enter your mobile number',
      password: 'Enter the password',
    });
  });

  test('phone must be 10 digits starting with 6-9', () => {
    expect(
      validateLogin({name: 'Om', phone: '12345', password: '1111'}).phone,
    ).toBe('Mobile number must be 10 digits');
    expect(
      validateLogin({name: 'Om', phone: '1234567890', password: '1111'}).phone,
    ).toBe('Mobile number must start with 6, 7, 8 or 9');
    expect(
      validateLogin({name: 'Om', phone: '98765-43210', password: '1111'}).phone,
    ).toBeUndefined();
  });

  test('name needs at least 2 characters', () => {
    expect(
      validateLogin({name: 'O', phone: '9876543210', password: '1111'}).name,
    ).toBe('Name must be at least 2 characters');
  });

  test('wrong password message', () => {
    expect(
      validateLogin({name: 'Om', phone: '9876543210', password: '0000'})
        .password,
    ).toBe('Incorrect password. Use 1111 for this demo');
  });

  test('digitsOnly strips everything but digits', () => {
    expect(digitsOnly('+91 98765-43210')).toBe('919876543210');
    expect(digitsOnly(undefined)).toBe('');
  });
});
