import { InferType, object, string } from 'yup';

import { MAX_LENGTH_MESSAGE, REQUIRED_CONTENT } from './addPostForm.constants';

export const addTweetSchema = object({
  content: string()
    .required(REQUIRED_CONTENT)
    .trim()
    .min(1, REQUIRED_CONTENT)
    .max(500, MAX_LENGTH_MESSAGE),
});

export type AddTweetFormData = InferType<typeof addTweetSchema>;
