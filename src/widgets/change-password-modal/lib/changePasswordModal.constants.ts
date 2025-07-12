export const CHANGE_TITLE = 'Change password';

export const CHANGE_SCHEMA = {
  PASSWORD: {
    REQUIRED: 'This filed is required',
    MIN_LEN: 'Password must be at least 8 characters long',
    MAX_LEN: 'Password must be at most 15 characters long',
    ONE_LOWER: 'Password must contain at least one lowercase letter',
    ONE_UPPER: 'Password must contain at least one uppercase letter',
    ONE_NUM: 'Password must contain at least one number',
    ONE_SPECIAL: 'Password must contain at least one special character',
  },
  CONFIRM_PASSWORD: {
    MATCH: 'Passwords must match',
  },
};
