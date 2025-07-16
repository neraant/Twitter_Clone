import * as yup from 'yup';

import { LOGIN_SCHEMA } from './loginForm.constants';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(LOGIN_SCHEMA.EMAIL.REQUIRED)
    .email(LOGIN_SCHEMA.EMAIL.INVALID_FORMAT),
  password: yup.string(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
