export const CHANGE_TITLE = 'Change password';

export const CHANGE_SCHEMA = {
  PASSWORD: {
    REQUIRED: 'Password is required',
    MIN_LEN: 'Password must be at least 8 characters',
    MAX_LEN: 'Password must not exceed 15 characters',
    ONE_LOWER: 'Password must contain at least one lowercase letter',
    ONE_UPPER: 'Password must contain at least one uppercase letter',
    ONE_NUM: 'Password must contain at least one number',
    ONE_SPECIAL: 'Password must contain at least one special character',
    SAME_AS_CURRENT: 'New password must be different from current password',
  },
  CONFIRM_PASSWORD: {
    MATCH: 'Passwords do not match',
  },
};
