// Pure login validation. Returns an object with one message per invalid field, empty when valid.

export const MOCK_PASSWORD = '1111';

export function digitsOnly(text) {
  return (text || '').replace(/\D/g, '');
}

export function validateLogin({name, phone, password}) {
  const errors = {};
  const cleanName = (name || '').trim();
  const cleanPhone = digitsOnly(phone);

  if (!cleanName) {
    errors.name = 'Enter your name';
  } else if (cleanName.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!cleanPhone) {
    errors.phone = 'Enter your mobile number';
  } else if (cleanPhone.length !== 10) {
    errors.phone = 'Mobile number must be 10 digits';
  } else if (!/^[6-9]/.test(cleanPhone)) {
    errors.phone = 'Mobile number must start with 6, 7, 8 or 9';
  }

  if (!password) {
    errors.password = 'Enter the password';
  } else if (password !== MOCK_PASSWORD) {
    errors.password = 'Incorrect password. Use 1111 for this demo';
  }

  return errors;
}

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
