export const TITLE = 'Log in to Twitter';

export const BUTTON_LABEL = 'Log In';

export const SIGN_UP_LINK = 'Sign up to Twitter';

export const PLACEHOLDERS = {
  EMAIL: 'Email address',
  PASSWORD: 'Password',
};

export const LOGIN_SCHEMA = {
  EMAIL: {
    REQUIRED: 'Email is required',
    INVALID_FORMAT: 'Invalid email format',
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
};
