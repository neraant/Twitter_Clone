import * as yup from 'yup';

import { LOGIN_SCHEMA } from './loginForm.constants';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(LOGIN_SCHEMA.EMAIL.REQUIRED)
    .email(LOGIN_SCHEMA.EMAIL.INVALID_FORMAT),
  password: yup
    .string()
    .required(LOGIN_SCHEMA.PASSWORD.REQUIRED)
    .min(8, LOGIN_SCHEMA.PASSWORD.MIN_LEN)
    .max(15, LOGIN_SCHEMA.PASSWORD.MAX_LEN)
    .matches(/[a-z]/, LOGIN_SCHEMA.PASSWORD.ONE_LOWER)
    .matches(/[A-Z]/, LOGIN_SCHEMA.PASSWORD.ONE_UPPER)
    .matches(/\d/, LOGIN_SCHEMA.PASSWORD.ONE_NUM)
    .matches(/[^A-Za-z0-9]/, LOGIN_SCHEMA.PASSWORD.ONE_SPECIAL),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
