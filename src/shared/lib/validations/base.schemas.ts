import * as yup from 'yup';

import { isValidAge } from './isValidAge.utils';
import {
  BIO_MAX_LEN,
  GENDER_OPTIONS,
  MAX_POST_LEN,
  MIN_POST_LEN,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PHONE_REGEX,
  TELEGRAM_NAME_REGEX,
} from './validation.constants';
import { VALIDATION_MESSAGES } from './validation.messages';

export const nameSchema = yup
  .string()
  .min(NAME_MIN_LENGTH, VALIDATION_MESSAGES.NAME.MIN_LEN)
  .max(NAME_MAX_LENGTH, VALIDATION_MESSAGES.NAME.MAX_LEN)
  .matches(/^[^\s]+$/, VALIDATION_MESSAGES.NAME.REQUIRED);

export const emailSchema = yup
  .string()
  .email(VALIDATION_MESSAGES.EMAIL.INVALID_FORMAT);

export const phoneSchema = yup
  .string()
  .matches(PHONE_REGEX, VALIDATION_MESSAGES.PHONE.INVALID_FORMAT);

export const passwordSchema = yup
  .string()
  .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD.MIN_LEN)
  .max(PASSWORD_MAX_LENGTH, VALIDATION_MESSAGES.PASSWORD.MAX_LEN)
  .matches(/[a-z]/, VALIDATION_MESSAGES.PASSWORD.ONE_LOWER)
  .matches(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD.ONE_UPPER)
  .matches(/\d/, VALIDATION_MESSAGES.PASSWORD.ONE_NUM)
  .matches(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.PASSWORD.ONE_SPECIAL);

export const confirmPasswordSchema = (ref: ReturnType<typeof yup.ref>) =>
  yup.string().oneOf([ref], VALIDATION_MESSAGES.CONFIRM_PASSWORD.MATCH);

export const birthYearSchema = yup
  .string()
  .test('min-age', VALIDATION_MESSAGES.BIRTH.MIN_AGE_ERROR, function (value) {
    const { birthDay, birthMonth } = this.parent;
    return isValidAge(value, birthMonth, birthDay);
  });

export const telegramSchema = yup.string().matches(TELEGRAM_NAME_REGEX, {
  message: VALIDATION_MESSAGES.TELEGRAM.INVALID,
  excludeEmptyString: true,
});

export const bioSchema = yup
  .string()
  .max(BIO_MAX_LEN, VALIDATION_MESSAGES.BIO.LENGTH);

export const genderShema = yup
  .string()
  .oneOf(GENDER_OPTIONS, VALIDATION_MESSAGES.GENDER.INVALID);

export const postShema = yup
  .string()
  .trim()
  .min(MIN_POST_LEN, VALIDATION_MESSAGES.POST.REQUIRED_CONTENT)
  .max(MAX_POST_LEN, VALIDATION_MESSAGES.POST.MAX_LENGTH_MESSAGE);
