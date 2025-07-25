import * as yup from 'yup';

import {
  bioSchema,
  genderShema,
  nameSchema,
  telegramSchema,
  VALIDATION_MESSAGES,
} from '@/shared/lib/validations';

export const editModalSchema = yup.object({
  name: nameSchema.required(VALIDATION_MESSAGES.NAME.REQUIRED),
  telegram: telegramSchema,
  bio: bioSchema,
  gender: genderShema,
});

export type EditFormData = yup.InferType<typeof editModalSchema>;
