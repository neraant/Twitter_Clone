export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 30;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;

export const MIN_AGE = 16;

export const BIO_MAX_LEN = 200;

export const PHONE_REGEX = /^\+375\((29|33|44)\)-\d{3}-\d{2}-\d{2}$/;
export const TELEGRAM_NAME_REGEX = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export const GENDER_OPTIONS = ['Male', 'Female'];

export const MIN_POST_LEN = 1;
export const MAX_POST_LEN = 500;

export const DAY_MIN = 1;
export const DAY_MAX = 31;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: currentYear - 1940 + 1 }, (_, i) =>
  (currentYear - i).toString(),
);
