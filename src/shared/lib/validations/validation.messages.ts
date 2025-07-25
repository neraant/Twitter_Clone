import {
  MIN_AGE,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './validation.constants';

export const VALIDATION_MESSAGES = {
  NAME: {
    REQUIRED: 'Name is required and cannot contain spaces',
    MIN_LEN: `Name must be at least ${NAME_MIN_LENGTH} characters`,
    MAX_LEN: `Name must be at most ${NAME_MAX_LENGTH} characters`,
  },
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID_FORMAT: 'Invalid email format',
  },
  PHONE: {
    REQUIRED: 'Phone number is required',
    INVALID_FORMAT: 'Invalid phone number format',
  },
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LEN: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    MAX_LEN: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
    ONE_LOWER: 'Password must contain at least one lowercase letter',
    ONE_UPPER: 'Password must contain at least one uppercase letter',
    ONE_NUM: 'Password must contain at least one number',
    ONE_SPECIAL: 'Password must contain at least one special character',
  },
  CONFIRM_PASSWORD: {
    REQUIRED: 'Please confirm your password',
    MATCH: 'Passwords must match',
  },
  BIRTH: {
    DAY_REQUIRED: 'Birth day is required',
    MONTH_REQUIRED: 'Birth month is required',
    YEAR_REQUIRED: 'Birth year is required',
    MIN_AGE_ERROR: `You must be at least ${MIN_AGE} y.o.`,
  },
};
