import * as yup from 'yup';

import { EDIT_SCHEMA, GENDER_OPTIONS } from './editProfileModal.constants';

const telegramUsernameRegex = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export const editModalSchema = yup.object({
  name: yup
    .string()
    .required(EDIT_SCHEMA.NAME.REQUIRED)
    .min(3, EDIT_SCHEMA.NAME.MIN_LEN)
    .max(20, EDIT_SCHEMA.NAME.MAX_LEN),
  telegram: yup
    .string()
    .matches(telegramUsernameRegex, EDIT_SCHEMA.TELEGRAM.INVALID),
  bio: yup.string().max(200, EDIT_SCHEMA.BIO.LENGTH),
  gender: yup.string().oneOf(GENDER_OPTIONS, EDIT_SCHEMA.GENDER.INVALID),
});

export type EditFormData = yup.InferType<typeof editModalSchema>;
