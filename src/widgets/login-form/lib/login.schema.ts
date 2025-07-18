import { InferType, object, string } from 'yup';

import { LOGIN_SCHEMA } from './loginForm.constants';

export const loginSchema = object({
  email: string()
    .required(LOGIN_SCHEMA.EMAIL.REQUIRED)
    .email(LOGIN_SCHEMA.EMAIL.INVALID_FORMAT),
  password: string(),
});

export type LoginFormData = InferType<typeof loginSchema>;
