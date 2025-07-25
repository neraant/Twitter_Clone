import * as yup from 'yup';

import {
  birthYearSchema,
  confirmPasswordSchema,
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  VALIDATION_MESSAGES,
} from '@/shared/lib/validations';

export const registerSchema = yup.object({
  name: nameSchema.required(VALIDATION_MESSAGES.NAME.REQUIRED),
  email: emailSchema.required(VALIDATION_MESSAGES.EMAIL.REQUIRED),
  phone_number: phoneSchema.required(VALIDATION_MESSAGES.PHONE.REQUIRED),
  password: passwordSchema.required(VALIDATION_MESSAGES.PASSWORD.REQUIRED),
  confirmPassword: confirmPasswordSchema(yup.ref('password')).required(
    VALIDATION_MESSAGES.CONFIRM_PASSWORD.REQUIRED,
  ),
  birthDay: yup.string().required(VALIDATION_MESSAGES.BIRTH.DAY_REQUIRED),
  birthMonth: yup.string().required(VALIDATION_MESSAGES.BIRTH.MONTH_REQUIRED),
  birthYear: birthYearSchema.required(VALIDATION_MESSAGES.BIRTH.YEAR_REQUIRED),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
