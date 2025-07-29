import { InferType, object, ref, string, StringSchema } from 'yup';

import { CHANGE_SCHEMA } from './changePasswordModal.constants';

export const basePasswordValidation = (schema: StringSchema) =>
  schema
    .min(8, CHANGE_SCHEMA.PASSWORD.MIN_LEN)
    .max(15, CHANGE_SCHEMA.PASSWORD.MAX_LEN)
    .matches(/[a-z]/, CHANGE_SCHEMA.PASSWORD.ONE_LOWER)
    .matches(/[A-Z]/, CHANGE_SCHEMA.PASSWORD.ONE_UPPER)
    .matches(/\d/, CHANGE_SCHEMA.PASSWORD.ONE_NUM)
    .matches(/[^A-Za-z0-9]/, CHANGE_SCHEMA.PASSWORD.ONE_SPECIAL);

export const changePasswordSchema = object({
  currentPassword: string().when('$isEmailUser', {
    is: true,
    then: (schema) =>
      basePasswordValidation(schema.required(CHANGE_SCHEMA.PASSWORD.REQUIRED)),
    otherwise: (schema) => schema.default(''),
  }),
  changePassword: string()
    .required(CHANGE_SCHEMA.PASSWORD.REQUIRED)
    .test(
      'not-same-as-current',
      CHANGE_SCHEMA.PASSWORD.SAME_AS_CURRENT,
      function (value) {
        const { currentPassword } = this.parent;
        const { isEmailUser } = this.options.context || {};

        if (isEmailUser && currentPassword && value) {
          return currentPassword !== value;
        }
        return true;
      },
    )
    .concat(basePasswordValidation(string())),
  confirmPassword: string()
    .required(CHANGE_SCHEMA.PASSWORD.REQUIRED)
    .oneOf([ref('changePassword')], CHANGE_SCHEMA.CONFIRM_PASSWORD.MATCH),
});

export type changePasswordFormData = InferType<typeof changePasswordSchema>;
