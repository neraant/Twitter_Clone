export const TITLE = 'Create an account';

export const BUTTON_LABEL = 'Next';

export const USE_GOOGLE_LINK = 'Use Google';

export const AGE_TITLE = 'Date of birth';
export const AGE_BODY =
  'Facilisi sem pulvinar velit nunc, gravida scelerisque amet nibh sit. Quis bibendum ante phasellus metus, magna lacinia sed augue. Odio enim nascetur leo mauris vel eget. Pretium id ullamcorper blandit viverra dignissim eget tellus. Nibh mi massa in molestie a sit. Elit congue.';

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

export const PLACEHOLDERS = {
  NAME: 'Name',
  PHONE: 'Phone number',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm password',
  DAY: 'Day',
  MONTH: 'Month',
  YEAR: 'Year',
};

export const REGISTER_SCHEMA = {
  NAME: {
    REQUIRED: 'Name is required',
    MIN_LEN: 'Name must be at least 3 characters',
    MAX_LEN: 'Name cannot exceed 20 characters',
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID_FORMAT: 'Invalid email format',
  },
  PHONE: {
    REQUIRED: 'Phone number is required',
    INVALID_FORMAT:
      'Phone number must match +375(XX)-XXX-XX-XX: codes (29,33,44)',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LEN: 'Password must be at least 8 characters long',
    MAX_LEN: 'Password must be at most 15 characters long',
    ONE_LOWER: 'Password must contain at least one lowercase letter',
    ONE_UPPER: 'Password must contain at least one uppercase letter',
    ONE_NUM: 'Password must contain at least one number',
    ONE_SPECIAL: 'Password must contain at least one special character',
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Confirm password is required',
    MATCH: 'Passwords must match',
  },
  BIRTH: {
    DAY_REQUIRED: 'Day is required',
    MONTH_REQUIRED: 'Month is required',
    YEAR_REQUIRED: 'Year is required',
    INVALID_DATE: 'Invalid date',
  },
};
