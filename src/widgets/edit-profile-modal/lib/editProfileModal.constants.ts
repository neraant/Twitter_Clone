export const EDIT_TITLE = 'Change info';
export const ADDITIONAL_INFO_TITLE = 'Additional info';
export const SAVE_BUTTON_LABEL = 'Save';
export const CHANGE_PASSWORD_BUTTON = 'Would you like to change your password?';

export const LABELS = {
  NAME: 'Name',
  TELEGRAM: 'Telegram link',
  BIO: 'Bio',
  GENDER: 'Gender',
};

export const GENDER_OPTIONS = ['Male', 'Female'];

export const EDIT_SCHEMA = {
  NAME: {
    REQUIRED: 'Name is required',
    MIN_LEN: 'Name must be at least 3 characters',
    MAX_LEN: 'Name cannot exceed 20 characters',
  },
  TELEGRAM: {
    INVALID: 'Telegram username is invalid',
  },
  BIO: {
    LENGTH: 'Maximum length is 200 symbold',
  },
  GENDER: {
    INVALID: 'Gender is invalid',
  },
};
