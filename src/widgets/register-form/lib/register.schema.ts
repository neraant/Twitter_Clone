import * as yup from 'yup';

import { MONTHS, REGISTER_SCHEMA } from './registerForm.constants';

const phoneRegex = /^\+375\((29|33|44)\)-\d{3}-\d{2}-\d{2}$/;
const MIN_AGE = 16;

export const registerSchema = yup.object({
  name: yup
    .string()
    .required(REGISTER_SCHEMA.NAME.REQUIRED)
    .min(3, REGISTER_SCHEMA.NAME.MIN_LEN)
    .max(20, REGISTER_SCHEMA.NAME.MAX_LEN)
    .matches(/^[^\s]+$/, REGISTER_SCHEMA.NAME.REQUIRED),
  email: yup
    .string()
    .required(REGISTER_SCHEMA.EMAIL.REQUIRED)
    .email(REGISTER_SCHEMA.EMAIL.INVALID_FORMAT),
  phone_number: yup
    .string()
    .required(REGISTER_SCHEMA.PHONE.REQUIRED)
    .matches(phoneRegex, REGISTER_SCHEMA.PHONE.INVALID_FORMAT),
  password: yup
    .string()
    .required(REGISTER_SCHEMA.PASSWORD.REQUIRED)
    .min(8, REGISTER_SCHEMA.PASSWORD.MIN_LEN)
    .max(15, REGISTER_SCHEMA.PASSWORD.MAX_LEN)
    .matches(/[a-z]/, REGISTER_SCHEMA.PASSWORD.ONE_LOWER)
    .matches(/[A-Z]/, REGISTER_SCHEMA.PASSWORD.ONE_UPPER)
    .matches(/\d/, REGISTER_SCHEMA.PASSWORD.ONE_NUM)
    .matches(/[^A-Za-z0-9]/, REGISTER_SCHEMA.PASSWORD.ONE_SPECIAL),
  confirmPassword: yup
    .string()
    .required(REGISTER_SCHEMA.CONFIRM_PASSWORD.REQUIRED)
    .oneOf([yup.ref('password')], REGISTER_SCHEMA.CONFIRM_PASSWORD.MATCH),
  birthDay: yup.string().required(REGISTER_SCHEMA.BIRTH.DAY_REQUIRED),
  birthMonth: yup.string().required(REGISTER_SCHEMA.BIRTH.MONTH_REQUIRED),
  birthYear: yup
    .string()
    .required(REGISTER_SCHEMA.BIRTH.YEAR_REQUIRED)
    .test('min-age', `You must be at least ${MIN_AGE} y.o.`, function (value) {
      const { birthDay, birthMonth } = this.parent;

      if (!value || !birthDay || !birthMonth) return true;

      const day = parseInt(birthDay, 10);
      const year = parseInt(value, 10);

      if (isNaN(day) || isNaN(year)) return false;
      if (day < 1 || day > 31) return false;

      const monthIndex = MONTHS.indexOf(birthMonth);
      if (monthIndex === -1) return false;

      const birthDate = new Date(year, monthIndex, day);

      if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== monthIndex ||
        birthDate.getDate() !== day
      ) {
        return false;
      }

      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= MIN_AGE;
    }),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
