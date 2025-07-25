import * as yup from 'yup';

import { emailSchema, passwordSchema } from '@/shared/lib/validations';

import { LOGIN_SCHEMA } from './loginForm.constants';

export const loginSchema = yup.object({
  email: emailSchema.required(LOGIN_SCHEMA.EMAIL.REQUIRED),
  password: passwordSchema,
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
