import * as yup from 'yup';

import { postShema } from '@/shared/lib/validations';

import { REQUIRED_CONTENT } from './addPostModal.constants';

export const addTweetSchema = yup.object({
  content: postShema.required(REQUIRED_CONTENT),
});

export type AddTweetFormData = yup.InferType<typeof addTweetSchema>;
