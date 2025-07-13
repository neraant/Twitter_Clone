import * as yup from 'yup';

import { MAX_LENGTH_MESSAGE, REQUIRED_CONTENT } from './addPostModal.constants';

export const addTweetSchema = yup.object({
  content: yup
    .string()
    .required(REQUIRED_CONTENT)
    .trim()
    .min(1, REQUIRED_CONTENT)
    .max(500, MAX_LENGTH_MESSAGE),
});

export type AddTweetFormData = yup.InferType<typeof addTweetSchema>;
