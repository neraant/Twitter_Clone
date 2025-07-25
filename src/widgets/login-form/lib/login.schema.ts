import * as yup from 'yup';

import { emailSchema } from '@/shared/lib/validations';

import { LOGIN_SCHEMA } from './loginForm.constants';

export const loginSchema = yup.object({
  email: emailSchema.required(LOGIN_SCHEMA.EMAIL.REQUIRED),
  password: yup.string(),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
