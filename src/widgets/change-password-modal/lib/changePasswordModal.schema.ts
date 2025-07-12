import * as yup from 'yup';

import { CHANGE_SCHEMA } from './changePasswordModal.constants';

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().when('$isEmailUser', {
    is: true,
    then: (schema) =>
      schema
        .required(CHANGE_SCHEMA.PASSWORD.REQUIRED)
        .min(8, CHANGE_SCHEMA.PASSWORD.MIN_LEN)
        .max(15, CHANGE_SCHEMA.PASSWORD.MAX_LEN)
        .matches(/[a-z]/, CHANGE_SCHEMA.PASSWORD.ONE_LOWER)
        .matches(/[A-Z]/, CHANGE_SCHEMA.PASSWORD.ONE_UPPER)
        .matches(/\d/, CHANGE_SCHEMA.PASSWORD.ONE_NUM)
        .matches(/[^A-Za-z0-9]/, CHANGE_SCHEMA.PASSWORD.ONE_SPECIAL),
    otherwise: (schema) => schema.strip(),
  }),
  changePassword: yup
    .string()
    .required(CHANGE_SCHEMA.PASSWORD.REQUIRED)
    .min(8, CHANGE_SCHEMA.PASSWORD.MIN_LEN)
    .max(15, CHANGE_SCHEMA.PASSWORD.MAX_LEN)
    .matches(/[a-z]/, CHANGE_SCHEMA.PASSWORD.ONE_LOWER)
    .matches(/[A-Z]/, CHANGE_SCHEMA.PASSWORD.ONE_UPPER)
    .matches(/\d/, CHANGE_SCHEMA.PASSWORD.ONE_NUM)
    .matches(/[^A-Za-z0-9]/, CHANGE_SCHEMA.PASSWORD.ONE_SPECIAL),
  confirmPassword: yup
    .string()
    .required(CHANGE_SCHEMA.PASSWORD.REQUIRED)
    .oneOf([yup.ref('changePassword')], CHANGE_SCHEMA.CONFIRM_PASSWORD.MATCH),
});

export type changePasswordFormData = yup.InferType<typeof changePasswordSchema>;
