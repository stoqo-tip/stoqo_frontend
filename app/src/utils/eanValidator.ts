import type { Code } from 'react-native-vision-camera';

function isDigitsOnly(value: string): boolean {
  return /^\d+$/.test(value);
}

function isValidEan8(value: string): boolean {
  if (!isDigitsOnly(value) || value.length !== 8) {
    return false;
  }

  const digits = value.split('').map(Number);
  const checkDigit = digits[7];

  const sum =
    digits[0] * 3 +
    digits[1] * 1 +
    digits[2] * 3 +
    digits[3] * 1 +
    digits[4] * 3 +
    digits[5] * 1 +
    digits[6] * 3;

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  return checkDigit === calculatedCheckDigit;
}

function isValidEan13(value: string): boolean {
  if (!isDigitsOnly(value) || value.length !== 13) {
    return false;
  }

  const digits = value.split('').map(Number);
  const checkDigit = digits[12];

  let sum = 0;

  for (let index = 0; index < 12; index += 1) {
    sum += digits[index] * (index % 2 === 0 ? 1 : 3);
  }

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  return checkDigit === calculatedCheckDigit;
}

export function isValidEan(type: Code['type'], value: string): boolean {
  if (type === 'ean-13') {
    return isValidEan13(value);
  }

  if (type === 'ean-8') {
    return isValidEan8(value);
  }

  return false;
}
