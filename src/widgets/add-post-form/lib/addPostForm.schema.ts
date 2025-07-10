import * as yup from 'yup';

import { MAX_LENGTH_MESSAGE, REQUIRED_CONTENT } from './addPostForm.constants';

export const addTweetSchema = yup.object({
  content: yup.string().required(REQUIRED_CONTENT).max(500, MAX_LENGTH_MESSAGE),
});

export type AddTweetFormData = yup.InferType<typeof addTweetSchema>;
